const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 9000;

// Import Routes
const heroRoutes = require("./Routes/HeroRoutes");
const achievementRoutes = require("./Routes/Achievements");
const signupRoutes = require("./Routes/Signup_r");
const loginRoutes = require("./Routes/Login_r");
const forgetRoutes = require("./Routes/Forget_r");
const bookRoutes = require("./Routes/BookRoutes");
const eventRoutes = require("./Routes/Event");

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/", eventRoutes);
app.use("/heros", heroRoutes);
app.use("/achievements", achievementRoutes);
app.use("/books", bookRoutes);
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/forget", forgetRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
