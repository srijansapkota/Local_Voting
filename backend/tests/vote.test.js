
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../app");
const { Member } = require("../models/resources");

let mongoServer;

beforeAll(async () => {
  process.env.JWT_Secret = "test_secret";
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.collection("users").deleteMany({});
  await mongoose.connection.collection("members").deleteMany({});
  await mongoose.connection.collection("votes").deleteMany({});
});

const testUser = {
  name: "Voter",
  email: "voter@example.com",
  password: "password123",
};

async function loggedInAgent() {
  const agent = request.agent(app);
  await agent.post("/api/auth/signup").send(testUser);
  return agent;
}

describe("POST /api/:category/:id/vote", () => {
  beforeEach(async () => {
    await Member.create({ id: "m1", name: "John Doe", designation: "President" });
  });

  it("registers a vote and increments the counter", async () => {
    const agent = await loggedInAgent();

    const res = await agent.post("/api/members/m1/vote").send({ type: "like" });

    expect(res.status).toBe(200);
    expect(res.body.like).toBe(1);
    expect(res.body.hasVoted).toBe(true);
  });

  it("blocks a second vote from the same user on the same item", async () => {
    const agent = await loggedInAgent();

    await agent.post("/api/members/m1/vote").send({ type: "like" });
    const secondAttempt = await agent.post("/api/members/m1/vote").send({ type: "dislike" });

    expect(secondAttempt.status).toBe(400);
    expect(secondAttempt.body.error).toMatch(/already voted/i);

    const member = await Member.findOne({ id: "m1" });
    expect(member.like).toBe(1);
    expect(member.dislike).toBe(0);
  });

  it("rejects voting when the user is not logged in", async () => {
    const res = await request(app).post("/api/members/m1/vote").send({ type: "like" });

    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the auth cookie so the user is no longer authenticated", async () => {
    const agent = await loggedInAgent();

    const logoutRes = await agent.post("/api/auth/logout");
    expect(logoutRes.status).toBe(200);

    const statusRes = await agent.get("/api/auth/status");
    expect(statusRes.status).toBe(401);
    expect(statusRes.body.authenticated).toBe(false);
  });
});