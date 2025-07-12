const mongoose = require("mongoose");

const feedbackVoteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  feedbackId: {
    type: String,
    required: true,
  },
  voteType: {
    type: String,
    enum: ["like", "dislike"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one vote per user per feedback
feedbackVoteSchema.index({ userId: 1, feedbackId: 1 }, { unique: true });

module.exports = mongoose.model("FeedbackVote", feedbackVoteSchema); 