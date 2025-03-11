const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 9000;


const cloudinary = require("cloudinary").v2;

// Import Routes
const heroRoutes = require("./Routes/HeroRoutes");
const achievementRoutes = require("./Routes/Achievements");
const signupRoutes = require("./Routes/Signup_r");
const loginRoutes = require("./Routes/Login_r");
const forgetRoutes = require("./Routes/Forget_r");
const bookRoutes = require("./Routes/BookRoutes");
const eventRoutes = require("./Routes/Event");
const P_Books = require("./Routes/pathippagam_books");
const pathipagamEvents = require("./Routes/PathipagamEvents");
const newsletterRoutes = require("./Routes/newsletters");
//const PeventsRoutes = require("./Routes/pathippagam_events");
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
app.use("/books", bookRoutes);
app.use("/p_books", P_Books);
app.use("/events", eventRoutes);
//app.use("/p_events", PeventsRoutes);
app.use("/heros", heroRoutes);
app.use("/achievements", achievementRoutes);
app.use("/signup/sigin", signupRoutes);
app.use("/login", loginRoutes);
app.use("/forget", forgetRoutes);
app.use("/pathipagamEvent", pathipagamEvents);
app.use("/newsletters", newsletterRoutes);
// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
