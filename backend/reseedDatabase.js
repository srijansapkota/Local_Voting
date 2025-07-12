const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Import models
const Member = require("./models/members");
const Entity = require("./models/entities");
const Feedback = require("./models/feedback..js");
const Vote = require("./models/votes");
const EntityVote = require("./models/entityVotes");
const FeedbackVote = require("./models/feedbackVotes");

// Read data files
const membersPath = path.join(__dirname, "../frontend/src/data/members.json");
const entitiesPath = path.join(__dirname, "../frontend/src/data/entities.json");
const feedbackPath = path.join(__dirname, "../frontend/src/data/feedbackData.json");

const membersData = JSON.parse(fs.readFileSync(membersPath, "utf-8"));
const entitiesData = JSON.parse(fs.readFileSync(entitiesPath, "utf-8"));
const feedbackData = JSON.parse(fs.readFileSync(feedbackPath, "utf-8"));

const MONGOURL = process.env.MONGOURI || "mongodb://localhost:27017/normal_app";

async function reseedDatabase() {
  try {
    await mongoose.connect(MONGOURL);
    console.log("Connected to MongoDB");

    // Clear all existing data
    console.log("Clearing existing data...");
    await Member.deleteMany({});
    await Entity.deleteMany({});
    await Feedback.deleteMany({});
    await Vote.deleteMany({});
    await EntityVote.deleteMany({});
    await FeedbackVote.deleteMany({});
    console.log("Existing data cleared");

    // Seed members
    console.log("Seeding members...");
    for (const member of membersData) {
      await Member.create({
        id: member.id,
        name: member.name,
        designation: member.designation,
        like: member.like || 0,
        dislike: member.dislike || 0
      });
    }
    console.log(`Seeded ${membersData.length} members`);

    // Seed entities
    console.log("Seeding entities...");
    for (const entity of entitiesData) {
      await Entity.create({
        id: entity.id,
        name: entity.name,
        shortName: entity.shortName,
        image: entity.image || "",
        upvotes: entity.upvotes || 0,
        downvotes: entity.downvotes || 0
      });
    }
    console.log(`Seeded ${entitiesData.length} entities`);

    // Seed feedback
    console.log("Seeding feedback...");
    for (const feedback of feedbackData) {
      await Feedback.create({
        id: feedback.id,
        question: feedback.question,
        like: feedback.like || 0,
        dislike: feedback.dislike || 0
      });
    }
    console.log(`Seeded ${feedbackData.length} feedback items`);

    console.log("Database reseeding complete!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Reseeding error:", error);
    process.exit(1);
  }
}

reseedDatabase(); 