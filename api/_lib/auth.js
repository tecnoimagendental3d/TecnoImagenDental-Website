const jwt = require('jsonwebtoken');
const User = require('../_models/User');
const { connectDB } = require('./db');

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function verifyAuth(req) {
  await connectDB();
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Not authorized, no token', status: 401 };
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return { error: 'User not found', status: 401 };
    }

    if (user.role === 'doctor' && user.status !== 'approved') {
      return { error: 'Account not approved', status: 403 };
    }

    return { user };
  } catch (error) {
    return { error: 'Not authorized, token failed', status: 401 };
  }
}

async function verifyAdmin(req) {
  const result = await verifyAuth(req);
  
  if (result.error) {
    return result;
  }

  if (result.user.role !== 'admin') {
    return { error: 'Not authorized as admin', status: 403 };
  }

  return result;
}

module.exports = { generateToken, verifyAuth, verifyAdmin };

