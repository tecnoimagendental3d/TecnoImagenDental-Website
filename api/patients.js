const { connectDB } = require('./_lib/db');
const { verifyAuth } = require('./_lib/auth');
const Patient = require('./_models/Patient');
const Solicitud = require('./_models/Solicitud');

module.exports = async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (auth.error) return res.status(auth.status).json({ message: auth.error });

  await connectDB();
  const { id, solicitudId } = req.query;

  // GET /api/patients
  if (req.method === 'GET' && !id) {
    const { search, active } = req.query;
    const query = { doctor: auth.user._id };
    if (active !== undefined) query.isActive = active === 'true';
    let patients = await Patient.find(query).sort({ nombre: 1 });
    if (search) {
      const s = search.toLowerCase();
      patients = patients.filter(p => p.nombre.toLowerCase().includes(s) || p.telefono?.includes(search) || p.correoElectronico?.toLowerCase().includes(s));
    }
    return res.status(200).json(patients);
  }

  // GET /api/patients?id=xxx
  if (req.method === 'GET' && id) {
    const patient = await Patient.findOne({ _id: id, doctor: auth.user._id }).populate('solicitudes');
    if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
    return res.status(200).json(patient);
  }

  // POST /api/patients
  if (req.method === 'POST' && !solicitudId) {
    try {
      const { nombre, fechaNacimiento, edad, telefono, sexo, correoElectronico, direccion, notas } = req.body;
      const patient = await Patient.create({
        doctor: auth.user._id, nombre, fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        edad: edad ? parseInt(edad) : undefined, telefono, sexo, correoElectronico, direccion, notas,
      });
      return res.status(201).json(patient);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // POST /api/patients?solicitudId=xxx (from solicitud)
  if (req.method === 'POST' && solicitudId) {
    try {
      const solicitud = await Solicitud.findOne({ _id: solicitudId, doctor: auth.user._id });
      if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
      let patient = await Patient.findOne({ doctor: auth.user._id, nombre: solicitud.nombrePaciente, telefono: solicitud.telefono });
      if (patient) {
        if (!patient.solicitudes.includes(solicitud._id)) { patient.solicitudes.push(solicitud._id); await patient.save(); }
        return res.status(200).json({ message: 'Vinculado a paciente existente', patient, isNew: false });
      }
      patient = await Patient.create({
        doctor: auth.user._id, nombre: solicitud.nombrePaciente, fechaNacimiento: solicitud.fechaNacimiento,
        edad: solicitud.edad, telefono: solicitud.telefono, sexo: solicitud.sexo, correoElectronico: solicitud.correoElectronico, solicitudes: [solicitud._id],
      });
      return res.status(201).json({ message: 'Paciente creado', patient, isNew: true });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/patients?id=xxx
  if (req.method === 'PUT' && id) {
    try {
      const patient = await Patient.findOne({ _id: id, doctor: auth.user._id });
      if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
      const { nombre, fechaNacimiento, edad, telefono, sexo, correoElectronico, direccion, notas, isActive } = req.body;
      if (nombre) patient.nombre = nombre;
      if (fechaNacimiento) patient.fechaNacimiento = new Date(fechaNacimiento);
      if (edad !== undefined) patient.edad = parseInt(edad);
      if (telefono !== undefined) patient.telefono = telefono;
      if (sexo !== undefined) patient.sexo = sexo;
      if (correoElectronico !== undefined) patient.correoElectronico = correoElectronico;
      if (direccion !== undefined) patient.direccion = direccion;
      if (notas !== undefined) patient.notas = notas;
      if (isActive !== undefined) patient.isActive = isActive;
      await patient.save();
      return res.status(200).json(patient);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/patients?id=xxx
  if (req.method === 'DELETE' && id) {
    const patient = await Patient.findOneAndDelete({ _id: id, doctor: auth.user._id });
    if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
    return res.status(200).json({ message: 'Paciente eliminado' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

