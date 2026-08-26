const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../app");


let mongoServer

beforeAll(async()=>{
    process.env.JWT_Secret = "test_secret";
    mongoServer = await MongoMemoryServer.create();
await mongoose.connect(mongoServer.getUri())

});

afterAll(async ()=>{
    await mongoose.disconnect();
    await mongoServer.stop();
})

afterEach(async ()=> {
    await mongoose.connection.collection("users").deleteMany({})
})

const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123"
}

describe("POST /api/auth/signup", ()=>{
    it("creates a new user and sets a JWT cookie", async ()=> {
        const res = await request(app).post("/api/auth/signup").send(testUser)
        expect(res.status).toBe(201);
        expect(res.body.email).toBe(testUser.email);
        expect(res.headers['set-cookie']).toBeDefined();
    })
    it("rejects signup with duplicate email", async () => {
       await request(app).post("/api/auth/signup").send(testUser);
const res =  await request(app).post("/api/auth/signup").send(testUser);
        expect(res.status).toBe(400);
    })

})

describe ("POST /api/auth/login", ()=> {
    beforeEach(async()=>{
        await request(app).post("/api/auth/signup").send(testUser);
    })
    it("logs in with correct credentials and sets a JWT cookie", async ()=> {
        const res = await request(app).post("/api/auth/login").send({
            email: testUser.email,
            password: testUser.password,
        })
        expect(res.status).toBe(200);
        expect(res.headers['set-cookie']).toBeDefined();
    })
   
})

describe("GET /api/auth/status(JWT verification", ()=>{
    it("returns authenticated:true when a valid token cookie is sent", async ()=>{
        const agent = request.agent(app);
        await agent.post("/api/auth/signUp").send(testUser)
        const res = await agent.get("/api/auth/status");
        expect(res.status).toBe(200);
        expect(res.body.authenticated).toBe(true)
    })
    it("returns authenticated:flase when no token cookie is sent", async ()=> {
        const res = await request(app).get("/api/auth/status");
        expect(res.status).toBe(401);
        expect(res.body.authenticated).toBe(false)
    })
    it("returns authenticated:false for incorrect cookie", async()=> {
        const res = await request(app)
        .get("/api/auth/status")
        .set("Cookie", ['token=not-a-real-jwt']);
        expect(res.status).toBe(401);
        expect(res.body.authenticated).toBe(false)
    })
})