const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 9000;
const heroRoutes = require("./Routes/HeroRoutes");
const achievementRoutes = require("./Routes/Achievements");
const  Signup_r = require("./Routes/Signup_r");
const Login_r = require("./Routes/Login_r");
const Forget_r = require("./Routes/Forget_r")

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/eventsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));

// Routes
const eventRoutes = require("./Routes/Event");
app.use("/", eventRoutes);
app.use("/heros", heroRoutes);
app.use("/achievements", achievementRoutes);


app.use("/sigin", Signup_r);
app.use("/login", Login_r);
app.use("/forget", Forget_r);

// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));