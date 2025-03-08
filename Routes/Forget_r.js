
const express = require("express");
const router = express.Router();
const User = require("../Models/sign_up_s");


router.post("/pass", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if email exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the password
      user.password = password;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });


  module.exports = router;