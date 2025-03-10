const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const PathipagamEvent = require("../Models/PathipagamEvent");

const router = express.Router();

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add Pathipagam Event
router.post("/pathipagamEvents", upload.single("photo"), async (req, res) => {
  try {
    const { name, description, date, location, youtubeLink } = req.body;

    if (!name || !description || !date || !location) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    let photoUrl = "";
    if (req.file) {
      try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          resource_type: "auto",
          folder: "pathipagamEvents",
        });
        photoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ success: false, message: "Error uploading image", error: uploadError.message });
      }
    }

    const newEvent = new PathipagamEvent({
      name,
      description,
      date,
      location,
      youtubeLink,
      photoUrl,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ success: true, message: "Event created successfully", event: savedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});
// Update Pathipagam Event
router.put("/pathipagamEvents/:id", upload.single("photo"), async (req, res) => {
    try {
      const { name, description, date, location, youtubeLink } = req.body;
      const eventId = req.params.id;
  
      if (!name || !description || !date || !location) {
        return res.status(400).json({ success: false, message: "All required fields must be provided" });
      }
  
      const event = await PathipagamEvent.findById(eventId);
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });
  
      let photoUrl = event.photoUrl;
  
      if (req.file) {
        try {
          // Delete old image from Cloudinary if it exists
          if (event.photoUrl) {
            const publicId = event.photoUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          }
  
          // Upload new image
          const b64 = Buffer.from(req.file.buffer).toString("base64");
          const dataURI = `data:${req.file.mimetype};base64,${b64}`;
          const uploadResult = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
            folder: "pathipagamEvents",
          });
          photoUrl = uploadResult.secure_url;
        } catch (uploadError) {
          return res.status(500).json({ success: false, message: "Error uploading image", error: uploadError.message });
        }
      }
  
      // Update event details
      event.name = name;
      event.description = description;
      event.date = date;
      event.location = location;
      event.youtubeLink = youtubeLink;
      event.photoUrl = photoUrl;
  
      const updatedEvent = await event.save();
      res.status(200).json({ success: true, message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  });
  
// Get All Events
router.get("/pathipagamEvents", async (req, res) => {
  try {
    const events = await PathipagamEvent.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// Get Single Event
router.get("/pathipagamEvents/:id", async (req, res) => {
  try {
    const event = await PathipagamEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event details", error });
  }
});

// Delete Event
router.delete("/pathipagamEvents/:id", async (req, res) => {
  try {
    const event = await PathipagamEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.photoUrl) {
      const publicId = event.photoUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await PathipagamEvent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
});

// Like Event
router.post("/pathipagamEvents/:id/like", async (req, res) => {
  try {
    const event = await PathipagamEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.likes += 1;
    await event.save();

    res.json({ success: true, likes: event.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating likes", error: error.message });
  }
});

// Unlike Event
router.post("/pathipagamEvents/:id/unlike", async (req, res) => {
  try {
    const event = await PathipagamEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.likes = Math.max(0, event.likes - 1);
    await event.save();

    res.json({ success: true, likes: event.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating likes", error: error.message });
  }
});

module.exports = router;
