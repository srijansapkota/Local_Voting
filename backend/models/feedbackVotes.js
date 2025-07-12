const mongoose = require("mongoose");

const feedbackVoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  feedbackId: { type: mongoose.Schema.Types.Mixed, required: true }, // Accept both string and number
  voteType: { type: String, enum: ["like", "dislike"], required: true },
});

// Only create the model if it doesn't already exist
const FeedbackVote = mongoose.models.FeedbackVote || mongoose.model("FeedbackVote", feedbackVoteSchema);

module.exports = FeedbackVote; 