const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const memberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Member = mongoose.model("Member", memberSchema);

// Read members.json
const membersPath = path.join(__dirname, "../src/data/members.json");
const cardData = JSON.parse(fs.readFileSync(membersPath, "utf-8"));

const MONGOURL = process.env.MONGOURI || "mongodb://localhost:27017/normal_app";

async function seed() {
  await mongoose.connect(MONGOURL);
  for (const member of cardData) {
    await Member.updateOne(
      { id: member.id },
      { $set: { ...member } },
      { upsert: true }
    );
  }
  console.log("Seeding complete");
  await mongoose.disconnect();
}

seed();
