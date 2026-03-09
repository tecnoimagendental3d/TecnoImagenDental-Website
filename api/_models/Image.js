const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    filename: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    patientName: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

imageSchema.index({ user: 1, date: -1 });
imageSchema.index({ patientName: 1 });

module.exports = mongoose.models.Image || mongoose.model('Image', imageSchema);

