const mongoose = require("mongoose");

const entitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  image: { type: String },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

// Only create the model if it doesn't already exist
const Entity = mongoose.models.Entity || mongoose.model("Entity", entitySchema);

module.exports = Entity;
