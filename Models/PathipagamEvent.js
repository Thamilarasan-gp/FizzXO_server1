const mongoose = require("mongoose");

const pathipagamEventSchema = new mongoose.Schema({
  name: String,
  description: String,
  photoUrl: String,
  youtubeLink: String,
  date: String,
  location: String,
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model("PathipagamEvent", pathipagamEventSchema);
