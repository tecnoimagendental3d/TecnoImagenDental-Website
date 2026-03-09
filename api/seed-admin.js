const { connectDB } = require('./_lib/db');
const User = require('./_models/User');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { secretKey } = req.body;
  
  if (secretKey !== process.env.ADMIN_SEED_SECRET) {
    return res.status(401).json({ message: 'Invalid secret key' });
  }

  try {
    await connectDB();

    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@tecnoimagendental.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
    const adminName = process.env.DEFAULT_ADMIN_NAME || 'Administrador';

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      return res.status(200).json({ 
        message: 'Admin account already exists',
        email: adminEmail 
      });
    }

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      status: 'approved'
    });

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
