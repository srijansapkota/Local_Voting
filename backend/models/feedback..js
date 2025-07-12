const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Unique identifier for the feedback item
  question: { type: String, required: true }, // The feedback question/text
  // URL for associated image
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
feedbackSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Only create the model if it doesn't already exist
const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
