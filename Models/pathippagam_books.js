const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookname: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true }, // Ensure it's required
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);

const Books = mongoose.model("p_books", bookSchema);
module.exports = Books;
