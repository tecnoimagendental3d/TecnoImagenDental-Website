const { connectDB } = require('./_lib/db');
const { verifyAuth } = require('./_lib/auth');
const Solicitud = require('./_models/Solicitud');
const User = require('./_models/User');

module.exports = async function handler(req, res) {
  await connectDB();
  const { id, action } = req.query;

  // POST /api/solicitudes (public - create)
  if (req.method === 'POST' && !action) {
    try {
      const { doctorEmail, fecha, nombrePaciente, fechaNacimiento, edad, telefono, sexo, doctorSolicitante, correoElectronico, ...studies } = req.body;
      const doctor = await User.findOne({ email: doctorEmail.toLowerCase(), role: 'doctor', status: 'approved' });
      if (!doctor) return res.status(404).json({ message: 'Doctor no encontrado' });
      const solicitud = await Solicitud.create({
        doctor: doctor._id, fecha: new Date(fecha), nombrePaciente, fechaNacimiento: new Date(fechaNacimiento),
        edad: parseInt(edad), telefono, sexo, doctorSolicitante, correoElectronico,
        radiografia2D: { panoramica: studies.panoramica, panoramicaDientesHD: studies.panoramicaDientesHD, lateralCraneo: studies.lateralCraneo, apCraneo: studies.apCraneo, paCraneo: studies.paCraneo, atmBocaAbierta: studies.atmBocaAbierta, atmBocaCerrada: studies.atmBocaCerrada, senosParanasales: studies.senosParanasales, towneInversa: studies.towneInversa, hirtz: studies.hirtz, caldwell: studies.caldwell, waters: studies.waters, cavum: studies.cavum, carpal: studies.carpal },
        tomografia3D: { tomoCampoAmplio: studies.tomoCampoAmplio, tomoBimaxilar: studies.tomoBimaxilar, tomoMaxilar: studies.tomoMaxilar, tomoMandibular: studies.tomoMandibular, tomoViasAereas: studies.tomoViasAereas, tomoSenosParanasales: studies.tomoSenosParanasales, tomoAtmUnilateral: studies.tomoAtmUnilateral, tomoAtmUnilateralApertura: studies.tomoAtmUnilateralApertura, tomoAtmUnilateralOclusion: studies.tomoAtmUnilateralOclusion, tomoAtmBilateral: studies.tomoAtmBilateral, tomoAtmBilateralApertura: studies.tomoAtmBilateralApertura, tomoAtmBilateralOclusion: studies.tomoAtmBilateralOclusion, tomoZona5x5: studies.tomoZona5x5, conInterpretacion: studies.conInterpretacion, sinInterpretacion: studies.sinInterpretacion, propositoTomografia: studies.propositoTomografia },
        ortodoncia: { ortodonciaPanoramica: studies.ortodonciaPanoramica, ortodonciaLateralCraneo: studies.ortodonciaLateralCraneo, ortodonciaCefalometria: studies.ortodonciaCefalometria, ortodonciaConFoto: studies.ortodonciaConFoto, ortodonciaSinFoto: studies.ortodonciaSinFoto },
      });
      return res.status(201).json({ message: 'Solicitud enviada', solicitud });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Protected routes below
  const auth = await verifyAuth(req);
  if (auth.error) return res.status(auth.status).json({ message: auth.error });

  // GET /api/solicitudes
  if (req.method === 'GET' && !id && !action) {
    const { status } = req.query;
    const query = { doctor: auth.user._id };
    if (status) query.status = status;
    const solicitudes = await Solicitud.find(query).sort({ createdAt: -1 });
    return res.status(200).json(solicitudes);
  }

  // GET /api/solicitudes?action=pending-count
  if (req.method === 'GET' && action === 'pending-count') {
    const count = await Solicitud.countDocuments({ doctor: auth.user._id, status: 'pending' });
    return res.status(200).json({ count });
  }

  // GET /api/solicitudes?id=xxx
  if (req.method === 'GET' && id) {
    const solicitud = await Solicitud.findOne({ _id: id, doctor: auth.user._id });
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
    return res.status(200).json(solicitud);
  }

  // PUT /api/solicitudes?id=xxx&action=accept/reject/archive/restore
  if (req.method === 'PUT' && id && action) {
    const solicitud = await Solicitud.findOne({ _id: id, doctor: auth.user._id });
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
    
    if (action === 'accept' && solicitud.status !== 'accepted') {
      solicitud.status = 'accepted'; solicitud.doctorNotes = req.body?.notes || '';
    } else if (action === 'reject' && solicitud.status !== 'rejected') {
      solicitud.status = 'rejected'; solicitud.doctorNotes = req.body?.reason || '';
    } else if (action === 'archive' && solicitud.status !== 'archived') {
      solicitud.status = 'archived';
    } else if (action === 'restore' && ['archived', 'rejected'].includes(solicitud.status)) {
      solicitud.status = 'pending'; solicitud.doctorNotes = '';
    } else {
      return res.status(400).json({ message: 'Acción no válida' });
    }
    await solicitud.save();
    return res.status(200).json({ message: 'Solicitud actualizada', solicitud });
  }

  // DELETE /api/solicitudes?id=xxx
  if (req.method === 'DELETE' && id) {
    const solicitud = await Solicitud.findOneAndDelete({ _id: id, doctor: auth.user._id });
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
    return res.status(200).json({ message: 'Solicitud eliminada' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

