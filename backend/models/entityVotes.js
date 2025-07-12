const mongoose = require("mongoose");

const entityVoteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  entityId: {
    type: String,
    required: true,
  },
  voteType: {
    type: String,
    enum: ["up", "down"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one vote per user per entity
entityVoteSchema.index({ userId: 1, entityId: 1 }, { unique: true });

module.exports = mongoose.model("EntityVote", entityVoteSchema); 