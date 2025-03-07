const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  public_id: String, // Cloudinary public ID for deletion
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
