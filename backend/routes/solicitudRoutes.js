const express = require("express");
const router = express.Router();
const {
  createSolicitud,
  getSolicitudes,
  getPendingCount,
  getSolicitudById,
  acceptSolicitud,
  rejectSolicitud,
  archiveSolicitud,
  restoreSolicitud,
  deleteSolicitud,
} = require("../controllers/solicitudController");
const { protect } = require("../middlewares/authMiddleware");

// Public route - patients can create solicitudes
router.post("/", createSolicitud);

// Protected routes - doctors only
router.get("/", protect, getSolicitudes);
router.get("/pending-count", protect, getPendingCount);
router.get("/:id", protect, getSolicitudById);
router.put("/:id/accept", protect, acceptSolicitud);
router.put("/:id/reject", protect, rejectSolicitud);
router.put("/:id/archive", protect, archiveSolicitud);
router.put("/:id/restore", protect, restoreSolicitud);
router.delete("/:id", protect, deleteSolicitud);

module.exports = router;

