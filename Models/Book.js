const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookname: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);

const Books = mongoose.model("books", bookSchema);
module.exports = Books;
