const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const seedMembers = require('./seedMembers');
const seedEntities = require('./seedEntities');

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://normal-app2-1.onrender.com"],
    credentials: true,
  })
);

// Database connection
const MONGO_URI = process.env.MONGOURI;
if (!MONGO_URI) {
  console.error("MONGOURI environment variable is not defined");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Import routes
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const homeRoute = require("./routes/home");
const membersRoute = require("./routes/members");
const feedbackRoute = require("./routes/feedback");
const authRoute = require("./routes/auth");
const entitiesRoute = require("./routes/entities");

// Route middleware
app.use("/auth", signupRoute);
app.use("/auth", loginRoute);
app.use("/auth", logoutRoute);
app.use("/", homeRoute);
app.use("/members", membersRoute);
app.use("/feedback", feedbackRoute);
app.use("/auth", authRoute);
app.use("/entities", entitiesRoute);
app.get('/seed-all', async (req, res) => {
  try {
    // Run the seeder scripts
    require('./seedMembers');
    require('./seedEntities');
    res.send('Seeding complete! Check the server logs for details.');
  } catch (err) {
    res.status(500).send('Seeding failed: ' + err.message);
  }
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
