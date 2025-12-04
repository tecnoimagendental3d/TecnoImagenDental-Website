const mongoose = require("mongoose");

const solicitudSchema = new mongoose.Schema(
  {
    // The doctor this solicitud is assigned to
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
      index: true,
    },
    
    // Status of the solicitud
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'archived'],
      default: 'pending',
      index: true,
    },
    
    // Patient Information
    fecha: {
      type: Date,
      required: [true, "Fecha is required"],
    },
    nombrePaciente: {
      type: String,
      required: [true, "Nombre del paciente is required"],
      trim: true,
    },
    fechaNacimiento: {
      type: Date,
      required: [true, "Fecha de nacimiento is required"],
    },
    edad: {
      type: Number,
      required: [true, "Edad is required"],
    },
    telefono: {
      type: String,
      required: [true, "Teléfono is required"],
      trim: true,
    },
    sexo: {
      type: String,
      enum: ['M', 'F'],
      required: [true, "Sexo is required"],
    },
    doctorSolicitante: {
      type: String,
      required: [true, "Doctor solicitante is required"],
      trim: true,
    },
    correoElectronico: {
      type: String,
      required: [true, "Correo electrónico is required"],
      trim: true,
      lowercase: true,
    },
    
    // Radiografía 2D
    radiografia2D: {
      panoramica: { type: Boolean, default: false },
      panoramicaDientesHD: { type: Boolean, default: false },
      lateralCraneo: { type: Boolean, default: false },
      apCraneo: { type: Boolean, default: false },
      paCraneo: { type: Boolean, default: false },
      atmBocaAbierta: { type: Boolean, default: false },
      atmBocaCerrada: { type: Boolean, default: false },
      senosParanasales: { type: Boolean, default: false },
      towneInversa: { type: Boolean, default: false },
      hirtz: { type: Boolean, default: false },
      caldwell: { type: Boolean, default: false },
      waters: { type: Boolean, default: false },
      cavum: { type: Boolean, default: false },
      carpal: { type: Boolean, default: false },
    },
    
    // Tomografía 3D (CBCT)
    tomografia3D: {
      tomoCampoAmplio: { type: Boolean, default: false },
      tomoBimaxilar: { type: Boolean, default: false },
      tomoMaxilar: { type: Boolean, default: false },
      tomoMandibular: { type: Boolean, default: false },
      tomoViasAereas: { type: Boolean, default: false },
      tomoSenosParanasales: { type: Boolean, default: false },
      tomoAtmUnilateral: { type: Boolean, default: false },
      tomoAtmUnilateralApertura: { type: Boolean, default: false },
      tomoAtmUnilateralOclusion: { type: Boolean, default: false },
      tomoAtmBilateral: { type: Boolean, default: false },
      tomoAtmBilateralApertura: { type: Boolean, default: false },
      tomoAtmBilateralOclusion: { type: Boolean, default: false },
      tomoZona5x5: { type: Boolean, default: false },
      conInterpretacion: { type: Boolean, default: false },
      sinInterpretacion: { type: Boolean, default: false },
      propositoTomografia: { type: String, default: '', trim: true },
    },
    
    // Estudio de Ortodoncia
    ortodoncia: {
      ortodonciaPanoramica: { type: Boolean, default: false },
      ortodonciaLateralCraneo: { type: Boolean, default: false },
      ortodonciaCefalometria: { type: Boolean, default: false },
      ortodonciaConFoto: { type: Boolean, default: false },
      ortodonciaSinFoto: { type: Boolean, default: false },
    },
    
    // Doctor notes (for rejection reason, etc.)
    doctorNotes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
solicitudSchema.index({ doctor: 1, status: 1 });
solicitudSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Solicitud", solicitudSchema);

