const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register new doctor (public registration - requires admin approval)
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
     if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user as pending doctor (requires admin approval)
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: 'doctor',
      status: 'pending'
    });

    if (user) {
      // Don't return a token - account needs approval first
      res.status(201).json({
        success: true,
        message: "Cuenta creada exitosamente. Tu solicitud está pendiente de aprobación por un administrador.",
        pendingApproval: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          status: user.status,
        }
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Create admin (admin only)
// @route   POST /api/auth/create-admin
// @access  Private/Admin
exports.createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create admin user
    const user = await User.create({ name, email, password, role: 'admin' });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if doctor account is approved
    if (user.role === 'doctor' && user.status === 'pending') {
      return res.status(403).json({ 
        message: "Tu cuenta está pendiente de aprobación. Recibirás un correo cuando sea aprobada.",
        status: 'pending'
      });
    }

    if (user.role === 'doctor' && user.status === 'rejected') {
      return res.status(403).json({ 
        message: "Tu solicitud de cuenta ha sido rechazada. Contacta al administrador para más información.",
        status: 'rejected'
      });
    }

    if (user.role === 'doctor' && user.status === 'archived') {
      return res.status(403).json({ 
        message: "Tu cuenta ha sido archivada. Contacta al administrador para más información.",
        status: 'archived'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),

      businessName: user.businessName || "",
      address: user.address || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Request password reset (sends request to admin)
// @route   POST /api/auth/request-password-reset
// @access  Public
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Por favor ingresa tu email" });
    }

    const user = await User.findOne({ email, role: 'doctor' });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        success: true,
        message: "Si existe una cuenta con ese email, se ha enviado una solicitud de cambio de contraseña al administrador."
      });
    }

    // Set password reset request
    user.passwordResetRequested = true;
    user.passwordResetRequestedAt = new Date();
    await user.save();

    res.status(200).json({ 
      success: true,
      message: "Se ha enviado una solicitud de cambio de contraseña al administrador. Te contactarán pronto."
    });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,

      businessName: user.businessName || "",
      address: user.address || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.businessName = req.body.businessName || user.businessName;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone || user.phone;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        businessName: updatedUser.businessName,
        address: updatedUser.address,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar || "",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("UpdateUserProfile error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Upload user avatar
// @route   POST /api/auth/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Por favor selecciona una imagen" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      const fs = require('fs');
      const path = require('path');
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Save new avatar path (relative URL for serving)
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Avatar actualizado exitosamente",
      avatar: user.avatar,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        address: user.address,
        phone: user.phone,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error("UploadAvatar error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Delete user avatar
// @route   DELETE /api/auth/avatar
// @access  Private
exports.deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.avatar) {
      const fs = require('fs');
      const path = require('path');
      const avatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    user.avatar = '';
    await user.save();

    res.json({
      message: "Avatar eliminado exitosamente",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        address: user.address,
        phone: user.phone,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error("DeleteAvatar error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc    Get all pending doctor registrations
// @route   GET /api/auth/admin/pending-doctors
// @access  Private/Admin
exports.getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await User.find({ role: 'doctor', status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(pendingDoctors);
  } catch (error) {
    console.error("GetPendingDoctors error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get all doctors (approved, pending, rejected, archived)
// @route   GET /api/auth/admin/doctors
// @access  Private/Admin
exports.getAllDoctors = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { role: 'doctor' };
    
    if (status && ['pending', 'approved', 'rejected', 'archived'].includes(status)) {
      filter.status = status;
    }
    
    const doctors = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(doctors);
  } catch (error) {
    console.error("GetAllDoctors error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Create a new user (doctor or admin) by admin
// @route   POST /api/auth/admin/create-user
// @access  Private/Admin
exports.createUserByAdmin = async (req, res) => {
  const { name, email, password, role, status, businessName, phone, address } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, email y contraseña son requeridos" });
    }

    // Validate role
    const validRoles = ['doctor', 'admin'];
    const userRole = role || 'doctor';
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    // Validate status for doctors
    const validStatuses = ['pending', 'approved', 'rejected', 'archived'];
    let userStatus = status || (userRole === 'admin' ? 'approved' : 'approved'); // Default to approved when created by admin
    if (userRole === 'doctor' && status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }
    // Admins are always approved
    if (userRole === 'admin') {
      userStatus = 'approved';
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Ya existe un usuario con ese email" });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role: userRole,
      status: userStatus,
    };

    // Add optional fields for doctors
    if (userRole === 'doctor') {
      if (businessName) userData.businessName = businessName;
      if (phone) userData.phone = phone;
      if (address) userData.address = address;
    }

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        message: `Usuario ${userRole === 'admin' ? 'administrador' : 'doctor'} creado exitosamente`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          businessName: user.businessName || '',
          phone: user.phone || '',
          address: user.address || '',
          createdAt: user.createdAt,
        }
      });
    } else {
      res.status(400).json({ message: "Error al crear usuario" });
    }
  } catch (error) {
    console.error("CreateUserByAdmin error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get all password reset requests
// @route   GET /api/auth/admin/password-reset-requests
// @access  Private/Admin
exports.getPasswordResetRequests = async (req, res) => {
  try {
    const requests = await User.find({ 
      role: 'doctor', 
      passwordResetRequested: true 
    })
      .select('-password')
      .sort({ passwordResetRequestedAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error("GetPasswordResetRequests error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Update user information (admin can change name, email, password)
// @route   PUT /api/auth/admin/user/:id
// @access  Private/Admin
exports.updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, businessName, phone, address } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Prevent admin from editing themselves through this route
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "No puedes editar tu propia cuenta desde aquí" });
    }

    // Check if new email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ message: "El email ya está en uso por otro usuario" });
      }
      user.email = email;
    }

    // Update fields
    if (name) user.name = name;
    if (businessName !== undefined) user.businessName = businessName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    
    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      }
      user.password = password; // Will be hashed by pre-save middleware
      // Clear password reset request when password is changed
      user.passwordResetRequested = false;
      user.passwordResetRequestedAt = null;
    }

    await user.save();

    res.json({ 
      message: "Usuario actualizado exitosamente",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        businessName: user.businessName,
        phone: user.phone,
        address: user.address,
        passwordResetRequested: user.passwordResetRequested,
      }
    });
  } catch (error) {
    console.error("UpdateUserByAdmin error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Change user status (approve, reject, archive)
// @route   PUT /api/auth/admin/user/:id/status
// @access  Private/Admin
exports.changeUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'archived'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.role !== 'doctor') {
      return res.status(400).json({ message: "Solo se puede cambiar el estado de cuentas de doctores" });
    }

    // Prevent setting same status
    if (user.status === status) {
      return res.status(400).json({ message: `El usuario ya tiene el estado "${status}"` });
    }

    user.status = status;
    await user.save();

    const statusMessages = {
      pending: 'pendiente',
      approved: 'aprobado',
      rejected: 'rechazado',
      archived: 'archivado'
    };

    res.json({ 
      message: `Usuario ${statusMessages[status]} exitosamente`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      }
    });
  } catch (error) {
    console.error("ChangeUserStatus error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Clear password reset request
// @route   PUT /api/auth/admin/user/:id/clear-reset-request
// @access  Private/Admin
exports.clearPasswordResetRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.passwordResetRequested = false;
    user.passwordResetRequestedAt = null;
    await user.save();

    res.json({ 
      message: "Solicitud de cambio de contraseña descartada",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("ClearPasswordResetRequest error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Approve a doctor registration
// @route   PUT /api/auth/admin/approve/:id
// @access  Private/Admin
exports.approveDoctor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 'doctor') {
      return res.status(400).json({ message: "Can only approve doctor accounts" });
    }

    user.status = 'approved';
    await user.save();

    // TODO: Send approval email to doctor

    res.json({ 
      message: "Doctor approved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      }
    });
  } catch (error) {
    console.error("ApproveDoctor error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Reject a doctor registration
// @route   PUT /api/auth/admin/reject/:id
// @access  Private/Admin
exports.rejectDoctor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 'doctor') {
      return res.status(400).json({ message: "Can only reject doctor accounts" });
    }

    user.status = 'rejected';
    await user.save();

    // TODO: Send rejection email to doctor

    res.json({ 
      message: "Doctor registration rejected",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      }
    });
  } catch (error) {
    console.error("RejectDoctor error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Delete a user (admin only)
// @route   DELETE /api/auth/admin/user/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DeleteUser error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ==================== PUBLIC ENDPOINTS ====================

// @desc    Get all approved doctors (for patient forms)
// @route   GET /api/auth/doctors
// @access  Public
exports.getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', status: 'approved' })
      .select('name email businessName')
      .sort({ name: 1 });
    
    res.json(doctors);
  } catch (error) {
    console.error("GetApprovedDoctors error:", error);
    res.status(500).json({ 
      message: error.message || "Server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
