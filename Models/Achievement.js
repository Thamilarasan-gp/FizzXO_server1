const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photoUrl: String,
  date: { type: String, required: true },
  location: { type: String, required: true },
});

const Achievement = mongoose.model("Achievement", achievementSchema);
module.exports = Achievement;   