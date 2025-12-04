const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getMe, 
  updateUserProfile,
  createAdmin,
  getPendingDoctors,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  deleteUser,
  getApprovedDoctors,
  requestPasswordReset,
  getPasswordResetRequests,
  updateUserByAdmin,
  changeUserStatus,
  clearPasswordResetRequest,
  uploadAvatar,
  deleteAvatar,
  createUserByAdmin
} = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');
const avatarUpload = require('../middlewares/avatarUploadMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.get('/doctors', getApprovedDoctors); // Public - for patient forms

// Protected routes (any authenticated user)
router.route('/me').get(protect, getMe).put(protect, updateUserProfile);
router.route('/avatar')
  .post(protect, avatarUpload.single('avatar'), uploadAvatar)
  .delete(protect, deleteAvatar);

// Admin routes
router.post('/admin/create-admin', protect, admin, createAdmin);
router.post('/admin/create-user', protect, admin, createUserByAdmin);
router.get('/admin/pending-doctors', protect, admin, getPendingDoctors);
router.get('/admin/doctors', protect, admin, getAllDoctors);
router.get('/admin/password-reset-requests', protect, admin, getPasswordResetRequests);
router.put('/admin/approve/:id', protect, admin, approveDoctor);
router.put('/admin/reject/:id', protect, admin, rejectDoctor);
router.put('/admin/user/:id', protect, admin, updateUserByAdmin);
router.put('/admin/user/:id/status', protect, admin, changeUserStatus);
router.put('/admin/user/:id/clear-reset-request', protect, admin, clearPasswordResetRequest);
router.delete('/admin/user/:id', protect, admin, deleteUser);

module.exports = router;
