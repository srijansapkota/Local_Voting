const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Member = require("./models/members");

// Read members.json
const membersPath = path.join(__dirname, "../frontend/src/data/members.json");
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
