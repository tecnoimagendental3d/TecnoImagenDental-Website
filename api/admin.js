const { connectDB } = require('./_lib/db');
const { verifyAdmin } = require('./_lib/auth');
const User = require('./_models/User');

module.exports = async function handler(req, res) {
  const auth = await verifyAdmin(req);
  if (auth.error) return res.status(auth.status).json({ message: auth.error });

  await connectDB();
  const { action, id } = req.query;

  // GET /api/admin?action=doctors
  if (req.method === 'GET' && action === 'doctors') {
    const { status } = req.query;
    const filter = { role: 'doctor' };
    if (status && ['pending', 'approved', 'rejected', 'archived'].includes(status)) filter.status = status;
    const doctors = await User.find(filter).select('-password').sort({ createdAt: -1 });
    return res.status(200).json(doctors);
  }

  // GET /api/admin?action=password-reset-requests
  if (req.method === 'GET' && action === 'password-reset-requests') {
    const requests = await User.find({ role: 'doctor', passwordResetRequested: true }).select('-password').sort({ passwordResetRequestedAt: -1 });
    return res.status(200).json(requests);
  }

  // POST /api/admin?action=create-user
  if (req.method === 'POST' && action === 'create-user') {
    try {
      const { name, email, password, role, status, businessName, phone, address } = req.body;
      if (!name || !email || !password) return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
      if (password.length < 6) return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
      const userRole = role || 'doctor';
      const userData = { name, email, password, role: userRole, status: userRole === 'admin' ? 'approved' : (status || 'approved') };
      if (userRole === 'doctor') { if (businessName) userData.businessName = businessName; if (phone) userData.phone = phone; if (address) userData.address = address; }
      const user = await User.create(userData);
      return res.status(201).json({ message: 'Usuario creado exitosamente', user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/admin?action=update-user&id=xxx
  if (req.method === 'PUT' && action === 'update-user' && id) {
    try {
      const { name, email, password, businessName, phone, address } = req.body;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      if (user._id.toString() === auth.user._id.toString()) return res.status(400).json({ message: 'No puedes editar tu propia cuenta' });
      if (email && email !== user.email) {
        const exists = await User.findOne({ email, _id: { $ne: user._id } });
        if (exists) return res.status(400).json({ message: 'El email ya está en uso' });
        user.email = email;
      }
      if (name) user.name = name;
      if (businessName !== undefined) user.businessName = businessName;
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;
      if (password) { user.password = password; user.passwordResetRequested = false; user.passwordResetRequestedAt = null; }
      await user.save();
      return res.status(200).json({ message: 'Usuario actualizado', user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/admin?action=change-status&id=xxx
  if (req.method === 'PUT' && action === 'change-status' && id) {
    try {
      const { status } = req.body;
      if (!status || !['pending', 'approved', 'rejected', 'archived'].includes(status)) return res.status(400).json({ message: 'Estado inválido' });
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      if (user.role !== 'doctor') return res.status(400).json({ message: 'Solo se puede cambiar el estado de doctores' });
      if (user.status === status) return res.status(400).json({ message: `El usuario ya tiene ese estado` });
      user.status = status;
      await user.save();
      return res.status(200).json({ message: 'Estado actualizado', user: { _id: user._id, name: user.name, email: user.email, status: user.status } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/admin?action=clear-reset&id=xxx
  if (req.method === 'PUT' && action === 'clear-reset' && id) {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    user.passwordResetRequested = false;
    user.passwordResetRequestedAt = null;
    await user.save();
    return res.status(200).json({ message: 'Solicitud descartada' });
  }

  // DELETE /api/admin?action=delete-user&id=xxx
  if (req.method === 'DELETE' && action === 'delete-user' && id) {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user._id.toString() === auth.user._id.toString()) return res.status(400).json({ message: 'Cannot delete yourself' });
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

