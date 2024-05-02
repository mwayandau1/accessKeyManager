/**
 *
 * Before you run the test, make sure comment the "start()" function call in app.js
 * This is to make sure the mongo0se url is running twice
 */

const request = require("supertest");
const app = require("../app"); // Assuming your Express app is exported from app.js
const User = require("../models/UserModel");
const Key = require("../models/KeyModel");
const mongoose = require("mongoose");

describe("Key API Endpoints", () => {
  let authToken;

  // Before all tests, log in a user and get auth token
  beforeAll(async () => {
    // Mock user data
    const userData = {
      email: "test@example.com",
      password: "password",
    };
    await mongoose.connect(
      "mongodb+srv://ayandau:moses21311@nodeexpress.4nrmugq.mongodb.net/testAccessKeyManager"
    );

    // Register user
    await request(app).post("/auth/register").send(userData);

    // Log in user to get auth token
    const loginResponse = await request(app).post("/auth/login").send(userData);
    authToken = loginResponse.body.token;
  }, 10000);

  afterAll(async () => {
    await User.deleteMany({});
    await Key.deleteMany({});
    await mongoose.connection.close();
  });

  it("should create a new key", async () => {
    const keyData = {
      keyName: "Test Key",
    };

    const response = await request(app)
      .post("/keys")
      .set("Authorization", `Bearer ${authToken}`)
      .send(keyData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Key generated successfully"
    );
    expect(response.body).toHaveProperty("key");
  }, 10000);

  // Test case for getting all keys
  it("should get all keys", async () => {
    const response = await request(app)
      .get("/keys")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("keys");
    expect(response.body.keys).toBeInstanceOf(Array);
  }, 10000);

  // Test case for getting a single key by ID
  it("should get a single key by ID", async () => {
    // Create a mock key
    const mockKey = await Key.create({
      keyName: "Mock Key",
      key: "mockKey",
      user: new mongoose.Types.ObjectId(), // Generate a valid ObjectId
    });

    const response = await request(app)
      .get(`/keys/${mockKey._id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("keyName", mockKey.keyName);
    expect(response.body).toHaveProperty("key", mockKey.key);
  }, 10000);

  // Test case for searching key by school email
  it("should search for a key by school email", async () => {
    const email = "test@example.com";

    const response = await request(app)
      .post("/keys/email")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("key");
  }, 10000);

  it("should revoke a key", async () => {
    // Generate a unique key value
    const uniqueKey = `mockKey_${Date.now()}`;

    // Create a mock key with the unique key value
    const mockKey = await Key.create({
      keyName: "Mock Key",
      key: uniqueKey,
      user: new mongoose.Types.ObjectId(),
    });

    try {
      const response = await request(app)
        .patch(`/keys/revoke-key/${mockKey._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      // Check if the response status code is 200 (OK)
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual("key revoked!");
    } catch (error) {
      // If a duplicate key error occurs, handle it gracefully
      if (error.code === 11000 && error.keyPattern && error.keyPattern.key) {
        // Return a 409 (Conflict) status code with an error message
        expect(error.response.statusCode).toBe(409);
        expect(error.response.body).toHaveProperty(
          "message",
          "Key already revoked"
        );
      } else {
        // If it's another error, re-throw it to fail the test
        throw error;
      }
    }
  });
});
