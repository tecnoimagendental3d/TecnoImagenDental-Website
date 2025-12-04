const express = require("express");
const {
  uploadImage,
  getImages,
  getImageById,
  deleteImage,
  downloadImage,
} = require("../controllers/imageController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const upload = require("../middlewares/uploadMiddleware.js");

const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("image"), uploadImage)
  .get(protect, getImages);

router
  .route("/:id")
  .get(protect, getImageById)
  .delete(protect, deleteImage);

router.route("/:id/download").get(protect, downloadImage);

module.exports = router;

