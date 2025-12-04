const Patient = require("../models/Patient");
const Solicitud = require("../models/Solicitud");
const path = require("path");
const fs = require("fs");

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private (Doctor)
const createPatient = async (req, res) => {
  try {
    const { nombre, fechaNacimiento, edad, telefono, sexo, correoElectronico, direccion, notas } = req.body;

    const patient = await Patient.create({
      doctor: req.user._id,
      nombre,
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
      edad: edad ? parseInt(edad) : undefined,
      telefono,
      sexo,
      correoElectronico,
      direccion,
      notas,
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error("Create patient error:", error);
    res.status(500).json({ message: "Error al crear paciente", error: error.message });
  }
};

// @desc    Get all patients for a doctor
// @route   GET /api/patients
// @access  Private (Doctor)
const getPatients = async (req, res) => {
  try {
    const { search, active } = req.query;
    const query = { doctor: req.user._id };
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    let patients = await Patient.find(query)
      .sort({ nombre: 1 });

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      patients = patients.filter(p => 
        p.nombre.toLowerCase().includes(searchLower) ||
        (p.telefono && p.telefono.includes(search)) ||
        (p.correoElectronico && p.correoElectronico.toLowerCase().includes(searchLower))
      );
    }

    res.json(patients);
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({ message: "Error al obtener pacientes", error: error.message });
  }
};

// @desc    Get a single patient by ID
// @route   GET /api/patients/:id
// @access  Private (Doctor)
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    }).populate('solicitudes');

    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    res.json(patient);
  } catch (error) {
    console.error("Get patient error:", error);
    res.status(500).json({ message: "Error al obtener paciente", error: error.message });
  }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private (Doctor)
const updatePatient = async (req, res) => {
  try {
    const { nombre, fechaNacimiento, edad, telefono, sexo, correoElectronico, direccion, notas, isActive } = req.body;

    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

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
    res.json(patient);
  } catch (error) {
    console.error("Update patient error:", error);
    res.status(500).json({ message: "Error al actualizar paciente", error: error.message });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private (Doctor)
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    res.json({ message: "Paciente eliminado" });
  } catch (error) {
    console.error("Delete patient error:", error);
    res.status(500).json({ message: "Error al eliminar paciente", error: error.message });
  }
};

// @desc    Upload document to patient
// @route   POST /api/patients/:id/documents
// @access  Private (Doctor)
const uploadDocument = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó ningún archivo" });
    }

    // Determine file type
    const ext = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'other';
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      fileType = 'image';
    } else if (ext === '.pdf') {
      fileType = 'pdf';
    } else if (['.doc', '.docx', '.txt', '.rtf'].includes(ext)) {
      fileType = 'document';
    }

    const document = {
      name: req.body.name || req.file.originalname,
      type: fileType,
      url: `/uploads/patients/${req.file.filename}`,
      notes: req.body.notes || '',
    };

    patient.documents.push(document);
    await patient.save();

    res.status(201).json({
      message: "Documento subido exitosamente",
      document: patient.documents[patient.documents.length - 1],
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({ message: "Error al subir documento", error: error.message });
  }
};

// @desc    Delete document from patient
// @route   DELETE /api/patients/:id/documents/:docId
// @access  Private (Doctor)
const deleteDocument = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const docIndex = patient.documents.findIndex(d => d._id.toString() === req.params.docId);
    if (docIndex === -1) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    // Optionally delete file from filesystem
    const docUrl = patient.documents[docIndex].url;
    const filePath = path.join(__dirname, '..', docUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    patient.documents.splice(docIndex, 1);
    await patient.save();

    res.json({ message: "Documento eliminado" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ message: "Error al eliminar documento", error: error.message });
  }
};

// @desc    Create patient from solicitud (when accepting)
// @route   POST /api/patients/from-solicitud/:solicitudId
// @access  Private (Doctor)
const createFromSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findOne({
      _id: req.params.solicitudId,
      doctor: req.user._id,
    });

    if (!solicitud) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    // Check if patient with same name and phone already exists for this doctor
    let patient = await Patient.findOne({
      doctor: req.user._id,
      nombre: solicitud.nombrePaciente,
      telefono: solicitud.telefono,
    });

    if (patient) {
      // Link solicitud to existing patient
      if (!patient.solicitudes.includes(solicitud._id)) {
        patient.solicitudes.push(solicitud._id);
        await patient.save();
      }
      return res.json({ message: "Solicitud vinculada a paciente existente", patient, isNew: false });
    }

    // Create new patient from solicitud data
    patient = await Patient.create({
      doctor: req.user._id,
      nombre: solicitud.nombrePaciente,
      fechaNacimiento: solicitud.fechaNacimiento,
      edad: solicitud.edad,
      telefono: solicitud.telefono,
      sexo: solicitud.sexo,
      correoElectronico: solicitud.correoElectronico,
      solicitudes: [solicitud._id],
    });

    res.status(201).json({ message: "Paciente creado desde solicitud", patient, isNew: true });
  } catch (error) {
    console.error("Create from solicitud error:", error);
    res.status(500).json({ message: "Error al crear paciente", error: error.message });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  uploadDocument,
  deleteDocument,
  createFromSolicitud,
};



