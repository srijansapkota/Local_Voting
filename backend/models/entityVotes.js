const mongoose = require("mongoose");

const entityVoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  entityId: { type: String, required: true },
  voteType: { type: String, enum: ["up", "down"], required: true },
});

// Only create the model if it doesn't already exist
const EntityVote = mongoose.models.EntityVote || mongoose.model("EntityVote", entityVoteSchema);

module.exports = EntityVote; 