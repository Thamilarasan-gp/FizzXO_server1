// const express = require("express");
// const multer = require("multer");
// const streamifier = require("streamifier");
// const Books = require("../Models/pathippagam_books");
// const cloudinary = require("cloudinary").v2;
// require("dotenv").config();

// const router = express.Router();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.MAJID_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.MAJID_CLOUDINARY_API_KEY,
//   api_secret: process.env.MAJID_CLOUDINARY_API_SECRET,
// });

// // Configure Multer for memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // 📌 Upload image to Cloudinary
// const uploadToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: "books" },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result.secure_url);
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };

// // 📌 Add a new book with image upload
// router.post("/added", upload.single("image"), async (req, res) => {
//   try {
//     console.log("Adding a new book...");

//     let imageUrl = "";
//     if (req.file) {
//       console.log("Uploading image to Cloudinary...");
//       imageUrl = await uploadToCloudinary(req.file.buffer);
//     }

//     const newBook = new Books({ ...req.body, image: imageUrl });
//     const savedBook = await newBook.save();

//     console.log("Book added successfully:", savedBook);
//     res.status(201).json(savedBook);
//   } catch (error) {
//     console.error("Error adding book:", error.message);
//     res.status(400).json({ message: error.message });
//   }
// });

// // 📌 Get all books
// router.get("/all", async (req, res) => {
//   try {
//     const books = await Books.find();
//     res.status(200).json(books);
//   } catch (error) {
//     console.error("Error fetching books:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// // 📌 Get a single book by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const book = await Books.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });
//     res.status(200).json(book);
//   } catch (error) {
//     console.error("Error fetching book:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// // 📌 Update a book by ID (Handles Image Update)
// router.put("/update/:id", upload.single("image"), async (req, res) => {
//   try {
//     let updatedData = { ...req.body };

//     const book = await Books.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     // If a new image is uploaded, upload it to Cloudinary
//     if (req.file) {
//       console.log("Uploading new image to Cloudinary...");
//       updatedData.image = await uploadToCloudinary(req.file.buffer);
//     }

//     const updatedBook = await Books.findByIdAndUpdate(req.params.id, updatedData, { new: true });

//     console.log("Book updated successfully:", updatedBook);
//     res.status(200).json(updatedBook);
//   } catch (error) {
//     console.error("Error updating book:", error.message);
//     res.status(400).json({ message: error.message });
//   }
// });

// // 📌 Delete a book by ID
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const deletedBook = await Books.findByIdAndDelete(req.params.id);
//     if (!deletedBook) return res.status(404).json({ message: "Book not found" });
//     console.log("book deleted...");
//     res.status(200).json({ message: "Book deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting book:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const streamifier = require("streamifier");
const Books = require("../Models/pathippagam_books");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.MAJID_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.MAJID_CLOUDINARY_API_KEY,
  api_secret: process.env.MAJID_CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "books" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// 📌 Add a new book with image upload
router.post("/added", upload.single("image"), async (req, res) => {
  try {
    console.log("Adding a new book...");

    let imageUrl = "";
    if (req.file) {
      console.log("Uploading image to Cloudinary...");
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const newBook = new Books({
      ...req.body,
      category: req.body.category || "", // ✅ Ensure category is included
      image: imageUrl,
    });

    const savedBook = await newBook.save();

    console.log("Book added successfully:", savedBook);
    res.status(201).json(savedBook);
  } catch (error) {
    console.error("Error adding book:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// router.post("/added", upload.single("image"), async (req, res) => {
//   try {
//     console.log("Addin.lllllllllllllllllllll",req.body.category);
//     console.log("Received data:", req.body);
    
//     let imageUrl = "";
//     if (req.file) {
//       console.log("Uploading image to Cloudinary...");
//       imageUrl = await uploadToCloudinary(req.file.buffer);
//     }

//     const newBook = new Books({
//       bookname: req.body.bookname,
//       title: req.body.title,
//       author: req.body.author,
//       description: req.body.description,
//       category: req.body.category || "", // ✅ Ensure category is included
//       image: imageUrl,
//     });

//    // console.log("Saving book to DB:", newBook);
//     const savedBook = await newBook.save();

//     // console.log("Book added successfully:", savedBook);
//     res.status(201).json(savedBook);
//   } catch (error) {
//     console.error("Error adding book:", error.message);
//     res.status(400).json({ message: error.message });
//   }
// });

// 📌 Get all books (Include Category)
router.get("/all", async (req, res) => {
  try {
    const books = await Books.find({}, "bookname title author description category image"); // ✅ Fetch category
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// 📌 Get a single book by ID (Include Category)
router.get("/:id", async (req, res) => {
  try {
    const book = await Books.findById(req.params.id, "bookname title author description category image"); // ✅ Fetch category
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(500).json({ message: error.message });
  }
});


// 📌 Update a book by ID (Handles Image Update & Category)
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    let updatedData = { ...req.body };

    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // ✅ Ensure category is included in update
    if (req.body.category) {
      updatedData.category = req.body.category;
    }

    // If a new image is uploaded, upload it to Cloudinary
    if (req.file) {
      console.log("Uploading new image to Cloudinary...");
      updatedData.image = await uploadToCloudinary(req.file.buffer);
    }

    const updatedBook = await Books.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    console.log("Book updated successfully:", updatedBook);
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// 📌 Delete a book by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedBook = await Books.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    console.log("Book deleted...");
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
