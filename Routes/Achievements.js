const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Achievement = require("../Models/Achievement");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title?.trim() || !description?.trim() || !date?.trim() || !location?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    let photoUrl = "";
    if (req.file) {
      try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataURI, { folder: "achievements" });
        photoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ success: false, message: "Image upload failed." });
      }
    }

    const newAchievement = new Achievement({
      title: title.trim(),
      description: description.trim(),
      photoUrl,
      date: date.trim(),
      location: location.trim(),
    });

    const savedAchievement = await newAchievement.save();
    res.status(201).json({ success: true, message: "Achievement added successfully.", achievement: savedAchievement });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching achievements", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ message: "Achievement not found" });

    if (achievement.photoUrl) {
      const publicId = achievement.photoUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Achievement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting achievement", error });
  }
});

module.exports = router;