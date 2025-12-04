const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  uploadDocument,
  deleteDocument,
  createFromSolicitud,
} = require("../controllers/patientController");
const { protect } = require("../middlewares/authMiddleware");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads", "patients");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for patient documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `patient-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|rtf/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype) || 
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (ext || mimeType) {
      return cb(null, true);
    }
    cb(new Error("Tipo de archivo no permitido"));
  },
});

// All routes are protected (Doctor only)
router.use(protect);

router.post("/", createPatient);
router.get("/", getPatients);
router.post("/from-solicitud/:solicitudId", createFromSolicitud);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);
router.post("/:id/documents", upload.single("file"), uploadDocument);
router.delete("/:id/documents/:docId", deleteDocument);

module.exports = router;



