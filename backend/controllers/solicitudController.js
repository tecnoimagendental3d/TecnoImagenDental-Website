const Solicitud = require("../models/Solicitud");
const User = require("../models/User");

// @desc    Create a new solicitud (public - patients)
// @route   POST /api/solicitudes
// @access  Public
const createSolicitud = async (req, res) => {
  try {
    const {
      doctorEmail,
      fecha,
      nombrePaciente,
      fechaNacimiento,
      edad,
      telefono,
      sexo,
      doctorSolicitante,
      correoElectronico,
      // Radiografía 2D
      panoramica, panoramicaDientesHD, lateralCraneo, apCraneo, paCraneo,
      atmBocaAbierta, atmBocaCerrada, senosParanasales, towneInversa,
      hirtz, caldwell, waters, cavum, carpal,
      // Tomografía 3D
      tomoCampoAmplio, tomoBimaxilar, tomoMaxilar, tomoMandibular,
      tomoViasAereas, tomoSenosParanasales, tomoAtmUnilateral,
      tomoAtmUnilateralApertura, tomoAtmUnilateralOclusion,
      tomoAtmBilateral, tomoAtmBilateralApertura, tomoAtmBilateralOclusion,
      tomoZona5x5, conInterpretacion, sinInterpretacion, propositoTomografia,
      // Ortodoncia
      ortodonciaPanoramica, ortodonciaLateralCraneo, ortodonciaCefalometria,
      ortodonciaConFoto, ortodonciaSinFoto,
    } = req.body;

    // Find the doctor by email
    const doctor = await User.findOne({ 
      email: doctorEmail.toLowerCase(), 
      role: 'doctor', 
      status: 'approved' 
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor no encontrado o no aprobado" });
    }

    const solicitud = await Solicitud.create({
      doctor: doctor._id,
      fecha: new Date(fecha),
      nombrePaciente,
      fechaNacimiento: new Date(fechaNacimiento),
      edad: parseInt(edad),
      telefono,
      sexo,
      doctorSolicitante,
      correoElectronico,
      radiografia2D: {
        panoramica, panoramicaDientesHD, lateralCraneo, apCraneo, paCraneo,
        atmBocaAbierta, atmBocaCerrada, senosParanasales, towneInversa,
        hirtz, caldwell, waters, cavum, carpal,
      },
      tomografia3D: {
        tomoCampoAmplio, tomoBimaxilar, tomoMaxilar, tomoMandibular,
        tomoViasAereas, tomoSenosParanasales, tomoAtmUnilateral,
        tomoAtmUnilateralApertura, tomoAtmUnilateralOclusion,
        tomoAtmBilateral, tomoAtmBilateralApertura, tomoAtmBilateralOclusion,
        tomoZona5x5, conInterpretacion, sinInterpretacion, propositoTomografia,
      },
      ortodoncia: {
        ortodonciaPanoramica, ortodonciaLateralCraneo, ortodonciaCefalometria,
        ortodonciaConFoto, ortodonciaSinFoto,
      },
    });

    res.status(201).json({
      message: "Solicitud enviada exitosamente",
      solicitud,
    });
  } catch (error) {
    console.error("Create solicitud error:", error);
    res.status(500).json({ message: "Error al crear la solicitud", error: error.message });
  }
};

// @desc    Get all solicitudes for a doctor
// @route   GET /api/solicitudes
// @access  Private (Doctor)
const getSolicitudes = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { doctor: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const solicitudes = await Solicitud.find(query)
      .sort({ createdAt: -1 });

    res.json(solicitudes);
  } catch (error) {
    console.error("Get solicitudes error:", error);
    res.status(500).json({ message: "Error al obtener solicitudes", error: error.message });
  }
};

// @desc    Get pending solicitudes count for a doctor
// @route   GET /api/solicitudes/pending-count
// @access  Private (Doctor)
const getPendingCount = async (req, res) => {
  try {
    const count = await Solicitud.countDocuments({ 
      doctor: req.user._id, 
      status: 'pending' 
    });
    res.json({ count });
  } catch (error) {
    console.error("Get pending count error:", error);
    res.status(500).json({ message: "Error al obtener conteo", error: error.message });
  }
};

// @desc    Get a single solicitud by ID
// @route   GET /api/solicitudes/:id
// @access  Private (Doctor)
const getSolicitudById = async (req, res) => {
  try {
    const solicitud = await Solicitud.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    res.json(solicitud);
  } catch (error) {
    console.error("Get solicitud error:", error);
    res.status(500).json({ message: "Error al obtener la solicitud", error: error.message });
  }
};

// @desc    Accept a solicitud
// @route   PUT /api/solicitudes/:id/accept
// @access  Private (Doctor)
const acceptSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findOne({
      _id: req.params.id,
      doctor: req.user._id,
      status: { $ne: 'accepted' }, // Can accept from any status except already accepted
    });

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada o ya aceptada" });
    }

    solicitud.status = 'accepted';
    solicitud.doctorNotes = req.body?.notes || '';
    await solicitud.save();

    res.json({ message: "Solicitud aceptada", solicitud });
  } catch (error) {
    console.error("Accept solicitud error:", error);
    res.status(500).json({ message: "Error al aceptar la solicitud", error: error.message });
  }
};

// @desc    Reject a solicitud
// @route   PUT /api/solicitudes/:id/reject
// @access  Private (Doctor)
const rejectSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findOne({
      _id: req.params.id,
      doctor: req.user._id,
      status: { $ne: 'rejected' }, // Can reject from any status except already rejected
    });

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada o ya rechazada" });
    }

    solicitud.status = 'rejected';
    solicitud.doctorNotes = req.body?.reason || '';
    await solicitud.save();

    res.json({ message: "Solicitud rechazada", solicitud });
  } catch (error) {
    console.error("Reject solicitud error:", error);
    res.status(500).json({ message: "Error al rechazar la solicitud", error: error.message });
  }
};

// @desc    Archive a solicitud
// @route   PUT /api/solicitudes/:id/archive
// @access  Private (Doctor)
const archiveSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findOne({
      _id: req.params.id,
      doctor: req.user._id,
      status: { $ne: 'archived' }, // Can archive from any status except already archived
    });

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada o ya archivada" });
    }

    solicitud.status = 'archived';
    await solicitud.save();

    res.json({ message: "Solicitud archivada", solicitud });
  } catch (error) {
    console.error("Archive solicitud error:", error);
    res.status(500).json({ message: "Error al archivar la solicitud", error: error.message });
  }
};

// @desc    Restore a solicitud (from archived or rejected to pending)
// @route   PUT /api/solicitudes/:id/restore
// @access  Private (Doctor)
const restoreSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findOne({
      _id: req.params.id,
      doctor: req.user._id,
      status: { $in: ['archived', 'rejected'] },
    });

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada o no se puede restaurar" });
    }

    solicitud.status = 'pending';
    solicitud.doctorNotes = '';
    await solicitud.save();

    res.json({ message: "Solicitud restaurada", solicitud });
  } catch (error) {
    console.error("Restore solicitud error:", error);
    res.status(500).json({ message: "Error al restaurar la solicitud", error: error.message });
  }
};

// @desc    Delete a solicitud
// @route   DELETE /api/solicitudes/:id
// @access  Private (Doctor)
const deleteSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findOneAndDelete({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    res.json({ message: "Solicitud eliminada" });
  } catch (error) {
    console.error("Delete solicitud error:", error);
    res.status(500).json({ message: "Error al eliminar la solicitud", error: error.message });
  }
};

module.exports = {
  createSolicitud,
  getSolicitudes,
  getPendingCount,
  getSolicitudById,
  acceptSolicitud,
  rejectSolicitud,
  archiveSolicitud,
  restoreSolicitud,
  deleteSolicitud,
};

