
const express = require("express");
const router = express.Router();
const User = require("../Models/sign_up_s");


router.post("/addit", async (req, res) => {
    try {
      const { email, password } = req.body; // Get email and password from request body
  
      // Check if the user exists
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the password matches (plain text for now, should use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      res.status(200).json({ message: "Login successful!", user: { id: user._id } });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  module.exports = router;