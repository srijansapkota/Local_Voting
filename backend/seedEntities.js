const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const entitySchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true, unique: true }, // Accept both string and number
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  image: { type: String },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

const Entity = mongoose.model("Entity", entitySchema);

// Entity data
const entitiesData = [
  {
    id: 1,
    name: "BCA (Bachelor of Computer Applications)",
    shortName: "BCA",
    image: "bca",
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 2,
    name: "BIM (Bachelor of Information Management)",
    shortName: "BIM",
    image: "bun",
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 3,
    name: "BBS (Bachelor of Business Studies)",
    shortName: "BBS",
    image: "bbs",
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 4,
    name: "BBA (Bachelor of Business Administration)",
    shortName: "BBA",
    image: "bba",
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 5,
    name: "BSc CSIT (Bachelor of Science in Computer Science & IT)",
    shortName: "BSc CSIT",
    image: "bsc_csit",
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 6,
    name: "BA (Bachelor of Arts)",
    shortName: "BA",
    image: "ba",
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 7,
    name: "BSW (Bachelor of Social Work)",
    shortName: "BSW",
    image: "bsw",
    upvotes: 0,
    downvotes: 0,
  },
  {
    id: 8,
    name: "BSc (Bachelor of Science)",
    shortName: "BSc",
    image: "bsc",
    upvotes: 0,
    downvotes: 0,
  },
];

const MONGOURL = process.env.MONGOURI || "mongodb://localhost:27017/normal_app";

async function seed() {
  try {
    await mongoose.connect(MONGOURL);
    console.log("Connected to MongoDB");
    
    for (const entity of entitiesData) {
      await Entity.updateOne(
        { id: entity.id },
        { $set: { ...entity } },
        { upsert: true }
      );
      console.log(`Seeded entity: ${entity.shortName}`);
    }
    
    console.log("Entity seeding complete");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed(); 