const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['image', 'pdf', 'document', 'other'], default: 'other' },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  notes: { type: String, trim: true, default: '' },
});

const patientSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    nombre: { type: String, required: true, trim: true },
    fechaNacimiento: { type: Date },
    edad: { type: Number },
    telefono: { type: String, trim: true },
    sexo: { type: String, enum: ['M', 'F', ''], default: '' },
    correoElectronico: { type: String, trim: true, lowercase: true },
    direccion: { type: String, trim: true, default: '' },
    notas: { type: String, trim: true, default: '' },
    documents: [documentSchema],
    solicitudes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Solicitud' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

patientSchema.index({ doctor: 1, nombre: 1 });
patientSchema.index({ doctor: 1, createdAt: -1 });

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

