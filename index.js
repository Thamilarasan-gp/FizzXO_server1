const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 9000;

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


// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));