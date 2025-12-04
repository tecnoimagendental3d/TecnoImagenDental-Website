const Image = require("../models/Image");
const fs = require("fs");
const path = require("path");

// @desc    Upload new image
// @route   POST /api/images
// @access  Private
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { patientName, description, date } = req.body;

    if (!patientName || !date) {
      // Delete uploaded file if validation fails
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: "Nombre Completo and Fecha are required" 
      });
    }

    // Store relative path from project root
    const relativePath = req.file.path.replace(/\\/g, '/').replace(/^.*uploads/, 'uploads');
    
    const image = new Image({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: relativePath,
      mimeType: req.file.mimetype,
      size: req.file.size,
      patientName,
      description: description || "",
      date: new Date(date),
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    // Delete uploaded file if save fails
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
};

// @desc    Get all images of logged-in user
// @route   GET /api/images
// @access  Private
exports.getImages = async (req, res) => {
  try {
    const { search, date } = req.query;
    let query = { user: req.user.id };

    // Filter by patient name
    if (search) {
      query.patientName = { $regex: search, $options: "i" };
    }

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const images = await Image.find(query)
      .sort({ date: -1, createdAt: -1 })
      .populate("user", "name email");
    
    res.json(images);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching images", error: error.message });
  }
};

// @desc    Get single image by ID
// @route   GET /api/images/:id
// @access  Private
exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id).populate("user", "name email");
    
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Check if the image belongs to the user
    if (image.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(image);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching image", error: error.message });
  }
};

// @desc    Delete image
// @route   DELETE /api/images/:id
// @access  Private
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Check if the image belongs to the user
    if (image.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, "..", image.path);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await Image.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting image", error: error.message });
  }
};

// @desc    Download image
// @route   GET /api/images/:id/download
// @access  Private
exports.downloadImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Check if the image belongs to the user
    if (image.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const filePath = path.join(__dirname, "..", image.path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, image.originalName);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading image", error: error.message });
  }
};

