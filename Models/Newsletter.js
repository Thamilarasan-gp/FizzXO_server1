const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrl: String,
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);
module.exports = Newsletter;
