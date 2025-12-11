const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'archived'], default: 'pending', index: true },
    fecha: { type: Date, required: true },
    nombrePaciente: { type: String, required: true, trim: true },
    fechaNacimiento: { type: Date, required: true },
    edad: { type: Number, required: true },
    telefono: { type: String, required: true, trim: true },
    sexo: { type: String, enum: ['M', 'F'], required: true },
    doctorSolicitante: { type: String, required: true, trim: true },
    correoElectronico: { type: String, required: true, trim: true, lowercase: true },
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
    ortodoncia: {
      ortodonciaPanoramica: { type: Boolean, default: false },
      ortodonciaLateralCraneo: { type: Boolean, default: false },
      ortodonciaCefalometria: { type: Boolean, default: false },
      ortodonciaConFoto: { type: Boolean, default: false },
      ortodonciaSinFoto: { type: Boolean, default: false },
    },
    doctorNotes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

solicitudSchema.index({ doctor: 1, status: 1 });
solicitudSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Solicitud || mongoose.model('Solicitud', solicitudSchema);

