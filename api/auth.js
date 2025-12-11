const { connectDB } = require('./_lib/db');
const { generateToken, verifyAuth } = require('./_lib/auth');
const User = require('./_models/User');

module.exports = async function handler(req, res) {
  await connectDB();
  const { action } = req.query;

  // POST /api/auth?action=register
  if (req.method === 'POST' && action === 'register') {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const user = await User.create({ name, email, password, role: 'doctor', status: 'pending' });
      return res.status(201).json({
        success: true,
        message: 'Cuenta creada exitosamente. Tu solicitud está pendiente de aprobación.',
        pendingApproval: true,
        user: { _id: user._id, name: user.name, email: user.email, status: user.status },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Server error' });
    }
  }

  // POST /api/auth?action=login
  if (req.method === 'POST' && action === 'login') {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      if (user.role === 'doctor') {
        if (user.status === 'pending') return res.status(403).json({ message: 'Tu cuenta está pendiente de aprobación.', status: 'pending' });
        if (user.status === 'rejected') return res.status(403).json({ message: 'Tu solicitud de cuenta ha sido rechazada.', status: 'rejected' });
        if (user.status === 'archived') return res.status(403).json({ message: 'Tu cuenta ha sido archivada.', status: 'archived' });
      }
      return res.status(200).json({
        _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status,
        token: generateToken(user._id), businessName: user.businessName || '', address: user.address || '',
        phone: user.phone || '', avatar: user.avatar || '',
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Server error' });
    }
  }

  // POST /api/auth?action=request-password-reset
  if (req.method === 'POST' && action === 'request-password-reset') {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Por favor ingresa tu email' });
      const user = await User.findOne({ email, role: 'doctor' });
      if (user) {
        user.passwordResetRequested = true;
        user.passwordResetRequestedAt = new Date();
        await user.save();
      }
      return res.status(200).json({ success: true, message: 'Si existe una cuenta con ese email, se ha enviado una solicitud.' });
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Server error' });
    }
  }

  // GET /api/auth?action=doctors (public - approved doctors)
  if (req.method === 'GET' && action === 'doctors') {
    try {
      const doctors = await User.find({ role: 'doctor', status: 'approved' }).select('name email businessName').sort({ name: 1 });
      return res.status(200).json(doctors);
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Server error' });
    }
  }

  // GET /api/auth?action=me
  if (req.method === 'GET' && action === 'me') {
    const auth = await verifyAuth(req);
    if (auth.error) return res.status(auth.status).json({ message: auth.error });
    return res.status(200).json({
      _id: auth.user._id, name: auth.user.name, email: auth.user.email, role: auth.user.role,
      businessName: auth.user.businessName || '', address: auth.user.address || '',
      phone: auth.user.phone || '', avatar: auth.user.avatar || '',
    });
  }

  // PUT /api/auth?action=me
  if (req.method === 'PUT' && action === 'me') {
    const auth = await verifyAuth(req);
    if (auth.error) return res.status(auth.status).json({ message: auth.error });
    try {
      const { name, businessName, address, phone } = req.body;
      const user = await User.findById(auth.user._id);
      if (name) user.name = name;
      if (businessName !== undefined) user.businessName = businessName;
      if (address !== undefined) user.address = address;
      if (phone !== undefined) user.phone = phone;
      await user.save();
      return res.status(200).json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        businessName: user.businessName, address: user.address, phone: user.phone, avatar: user.avatar || '',
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

