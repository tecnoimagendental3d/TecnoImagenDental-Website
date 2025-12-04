// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ['doctor', 'admin'],
      default: 'doctor',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'archived'],
      default: function() {
        // Admins are auto-approved, doctors need approval
        return this.role === 'admin' ? 'approved' : 'pending';
      },
    },
    passwordResetRequested: {
      type: Boolean,
      default: false,
    },
    passwordResetRequestedAt: {
      type: Date,
      default: null,
    },
    businessName: { 
      type: String, 
      default: '',
      trim: true,
      maxlength: [100, "Business name cannot exceed 100 characters"],
    },
    address: { 
      type: String, 
      default: '',
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    phone: { 
      type: String, 
      default: '',
      trim: true,
      match: [/^[\d\s\-\+\(\)]*$/, "Please provide a valid phone number"],
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
// Note: email index is auto-created by unique: true
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, status: 1 });

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
