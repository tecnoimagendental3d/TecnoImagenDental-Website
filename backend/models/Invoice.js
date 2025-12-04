const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Item name is required"],
    trim: true,
    maxlength: [200, "Item name cannot exceed 200 characters"],
  },
  quantity: { 
    type: Number, 
    required: [true, "Quantity is required"],
    min: [0.01, "Quantity must be greater than 0"],
  },
  unitPrice: { 
    type: Number, 
    required: [true, "Unit price is required"],
    min: [0, "Unit price cannot be negative"],
  },
  taxPercent: { 
    type: Number, 
    default: 0,
    min: [0, "Tax percent cannot be negative"],
    max: [100, "Tax percent cannot exceed 100"],
  },
  total: { 
    type: Number, 
    required: true,
    min: [0, "Total cannot be negative"],
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Invoice number cannot exceed 50 characters"],
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value >= this.invoiceDate;
        },
        message: "Due date must be on or after invoice date",
      },
    },
    billFrom: {
      businessName: {
        type: String,
        trim: true,
        maxlength: [100, "Business name cannot exceed 100 characters"],
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      },
      address: {
        type: String,
        trim: true,
        maxlength: [200, "Address cannot exceed 200 characters"],
      },
      phone: {
        type: String,
        trim: true,
        match: [/^[\d\s\-\+\(\)]+$/, "Please provide a valid phone number"],
      },
    },
    billTo: {
      clientName: {
        type: String,
        trim: true,
        maxlength: [100, "Client name cannot exceed 100 characters"],
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      },
      address: {
        type: String,
        trim: true,
        maxlength: [200, "Address cannot exceed 200 characters"],
      },
      phone: {
        type: String,
        trim: true,
        match: [/^[\d\s\-\+\(\)]+$/, "Please provide a valid phone number"],
      },
    },
    items: {
      type: [itemSchema],
      validate: {
        validator: function(items) {
          return items && items.length > 0;
        },
        message: "Invoice must have at least one item",
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    paymentTerms: {
      type: String,
      default: "Net 15",
      trim: true,
      maxlength: [50, "Payment terms cannot exceed 50 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["Confirmado", "No confirmado"],
        message: "Status must be either 'Confirmado' or 'No confirmado'",
      },
      default: "No confirmado",
    },
    subtotal: {
      type: Number,
      min: [0, "Subtotal cannot be negative"],
    },
    taxTotal: {
      type: Number,
      min: [0, "Tax total cannot be negative"],
    },
    total: {
      type: Number,
      min: [0, "Total cannot be negative"],
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
// Note: invoiceNumber index is auto-created by unique: true
// Note: user index is auto-created by index: true on field
invoiceSchema.index({ user: 1, createdAt: -1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ invoiceDate: -1 });
invoiceSchema.index({ dueDate: 1 });

module.exports = mongoose.model("Invoice", invoiceSchema);
