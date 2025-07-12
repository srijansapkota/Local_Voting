const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true, unique: true }, // Accept both string and number
  question: { type: String, required: true },
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Only create the model if it doesn't already exist
const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
