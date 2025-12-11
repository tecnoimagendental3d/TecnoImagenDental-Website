const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0.01 },
  unitPrice: { type: Number, required: true, min: 0 },
  taxPercent: { type: Number, default: 0, min: 0, max: 100 },
  total: { type: Number, required: true, min: 0 },
});

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    invoiceNumber: { type: String, required: true, trim: true, unique: true },
    invoiceDate: { type: Date, default: Date.now, required: true },
    dueDate: { type: Date },
    billFrom: {
      businessName: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      address: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    billTo: {
      clientName: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      address: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    items: { type: [itemSchema], validate: v => v && v.length > 0 },
    notes: { type: String, trim: true },
    paymentTerms: { type: String, default: 'Net 15', trim: true },
    status: { type: String, enum: ['Confirmado', 'No confirmado'], default: 'No confirmado' },
    subtotal: { type: Number, min: 0 },
    taxTotal: { type: Number, min: 0 },
    total: { type: Number, min: 0 },
  },
  { timestamps: true }
);

invoiceSchema.index({ user: 1, createdAt: -1 });
invoiceSchema.index({ status: 1 });

module.exports = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

