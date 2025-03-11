const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Newsletter = require('../Models/Newsletter');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add Newsletter
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { title, content, date } = req.body;
    if (!title || !content || !date) return res.status(400).json({ message: "All fields are required." });

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream({ folder: "newsletters" }, async (error, result) => {
        if (error) return res.status(500).json({ message: "Image upload failed." });
        const newNewsletter = new Newsletter({ title, content, date, imageUrl: result.secure_url });
        const savedNewsletter = await newNewsletter.save();
        res.status(201).json({ newsletter: savedNewsletter });
      });
      result.end(req.file.buffer);
    } else {
      const newNewsletter = new Newsletter({ title, content, date });
      const savedNewsletter = await newNewsletter.save();
      res.status(201).json({ newsletter: savedNewsletter });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch All Newsletters
router.get("/", async (req, res) => {
  try {
    const newsletters = await Newsletter.find();
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching newsletters" });
  }
});

// Update Newsletter
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const updatedData = { title, content, date };

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream({ folder: "newsletters" }, async (error, result) => {
        if (error) return res.status(500).json({ message: "Image upload failed." });
        updatedData.imageUrl = result.secure_url;
      });
      result.end(req.file.buffer);
    }

    const updatedNewsletter = await Newsletter.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ newsletter: updatedNewsletter });
  } catch (error) {
    res.status(500).json({ message: "Error updating newsletter" });
  }
});

// Delete Newsletter
router.delete("/:id", async (req, res) => {
  await Newsletter.findByIdAndDelete(req.params.id);
  res.json({ message: "Newsletter deleted successfully" });
});

module.exports = router;
