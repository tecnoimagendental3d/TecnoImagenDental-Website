require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const User = require("./models/User");

const authRoutes = require('./routes/authRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const aiRoutes = require('./routes/aiRoutes')
const imageRoutes = require('./routes/imageRoutes')
const solicitudRoutes = require('./routes/solicitudRoutes')
const patientRoutes = require('./routes/patientRoutes')

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect Database and seed admin
connectDB().then(async () => {
  // Create default admin from env if it doesn't exist
  await seedDefaultAdmin();
});

// Seed default admin account from environment variables
const seedDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!adminEmail || !adminPassword) {
      console.log('No default admin credentials in .env - skipping admin seed');
      return;
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        status: 'approved'
      });
      console.log(`✅ Default admin account created: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Admin account already exists: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

// Middleware
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes Here
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/patients", patientRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
