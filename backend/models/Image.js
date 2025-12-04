const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, "Original filename is required"],
      trim: true,
      maxlength: [255, "Original filename cannot exceed 255 characters"],
    },
    path: {
      type: String,
      required: [true, "File path is required"],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
      match: [/^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*$/, "Please provide a valid MIME type"],
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
      min: [0, "File size cannot be negative"],
      max: [50 * 1024 * 1024, "File size cannot exceed 50MB"], // 50MB limit
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [2, "Patient name must be at least 2 characters"],
      maxlength: [100, "Patient name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
imageSchema.index({ user: 1, date: -1 });
imageSchema.index({ patientName: 1 });
imageSchema.index({ date: -1 });
imageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Image", imageSchema);

