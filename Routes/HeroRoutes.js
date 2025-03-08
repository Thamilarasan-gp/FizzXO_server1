const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Image = require("../Models/Hero");

const router = express.Router();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Image to Cloudinary and Save to MongoDB
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI);

    const newImage = new Image({
      title: req.body.title,
      description: req.body.description,
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });

    await newImage.save();
    res.status(200).json({ message: "File uploaded", image: newImage });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
});

// Fetch all images
router.get("/gallery", async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
});

// Update image title & description
router.put("/files/:id", async (req, res) => {
  try {
    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description },
      { new: true }
    );
    res.json({ message: "Updated", image: updatedImage });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
});

// Delete an image
router.delete("/files/:id", async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
});

module.exports = router;
