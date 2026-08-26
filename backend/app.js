const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.FRONTEND_URL,
  credentials: true
}));


app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/resources"));

module.exports = app;