
const express = require("express");
const router = express.Router();
const User = require("../Models/sign_up_s");


router.post("/add", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if email already exists
    //   const existingUser = await User.findOne({ email });
    //   if (existingUser) {
    //     return res.status(400).json({ message: "Email already in use!" });
    //   }
  
      // Create new user
      const newUser = new User({ email, password,  name});
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;