const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Event = require("../Models/Event");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


router.post("/addevent", upload.single("photo"), async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const youtubeLink = req.body.youtubeLink || "";

    if (!name?.trim() || !description?.trim() || !date?.trim() || !location?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All required fields (name, description, date, location) must be provided",
      });
    }
    let photoUrl = "";
    if (req.file) {
      try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          resource_type: "auto",
          folder: "events",
        });
        photoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
          error: uploadError.message,
        });
      }
    }

    const newEvent = new Event({
      name: name.trim(),
      description: description.trim(),
      photoUrl,
      youtubeLink: youtubeLink.trim(),
      date: date.trim(),
      location: location.trim(),
    });

    const savedEvent = await newEvent.save();

    if (!savedEvent) {
      return res.status(500).json({
        success: false,
        message: "Failed to save event to database",
      });
    }

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

router.delete("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.photoUrl) {
      const publicId = event.photoUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event details", error });
  }
});

router.post("/events/:id/like", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }

    event.likes = (event.likes || 0) + 1;
    await event.save();

    res.json({ 
      success: true, 
      likes: event.likes 
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating likes", 
      error: error.message 
    });
  }
});

router.post("/events/:id/unlike", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }

    event.likes = Math.max(0, (event.likes || 0) - 1);
    await event.save();

    res.json({ 
      success: true, 
      likes: event.likes 
    });
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating likes", 
      error: error.message 
    });
  }
});
// Express route to update an event
router.put("/events/:id", upload.single("photo"), async (req, res) => {
  try {
      const eventId = req.params.id;
      const { name, description, date, location, youtubeLink } = req.body;

      let event = await Event.findById(eventId);
      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      let photoUrl = event.photoUrl; // Keep existing photo if not updated

      // If a new photo is uploaded, upload it to Cloudinary
      if (req.file) {
          const b64 = Buffer.from(req.file.buffer).toString("base64");
          const dataURI = `data:${req.file.mimetype};base64,${b64}`;
          const uploadResult = await cloudinary.uploader.upload(dataURI, {
              resource_type: "auto",
              folder: "events",
          });
          photoUrl = uploadResult.secure_url;
      }

      // Update event in the database
      event = await Event.findByIdAndUpdate(
          eventId,
          { name, description, date, location, youtubeLink, photoUrl },
          { new: true }
      );

      res.status(200).json({ success: true, message: "Event updated successfully", event });
  } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Error updating event", error });
  }
});
module.exports = router;