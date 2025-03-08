const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Achievement = require("../Models/Achievement");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add Achievement
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    if (!title || !description || !date || !location) return res.status(400).json({ message: "All fields are required." });

    let photoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream({ folder: "achievements" }, async (error, result) => {
        if (error) return res.status(500).json({ message: "Image upload failed." });
        const newAchievement = new Achievement({ title, description, date, location, photoUrl: result.secure_url });
        const savedAchievement = await newAchievement.save();
        res.status(201).json({ achievement: savedAchievement });
      });
      result.end(req.file.buffer);
    } else {
      const newAchievement = new Achievement({ title, description, date, location });
      const savedAchievement = await newAchievement.save();
      res.status(201).json({ achievement: savedAchievement });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch All Achievements
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching achievements" });
  }
});

// Update Achievement
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const updatedData = { title, description, date, location };

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream({ folder: "achievements" }, async (error, result) => {
        if (error) return res.status(500).json({ message: "Image upload failed." });
        updatedData.photoUrl = result.secure_url;
      });
      result.end(req.file.buffer);
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ achievement: updatedAchievement });
  } catch (error) {
    res.status(500).json({ message: "Error updating achievement" });
  }
});

// Delete Achievement
router.delete("/:id", async (req, res) => {
  await Achievement.findByIdAndDelete(req.params.id);
  res.json({ message: "Achievement deleted successfully" });
});

module.exports = router;
