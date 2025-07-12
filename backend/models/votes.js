const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  memberId: {
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

// Compound index to ensure one vote per user per member
voteSchema.index({ userId: 1, memberId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema); 