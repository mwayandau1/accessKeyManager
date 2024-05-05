/**
 *
 * Before you run the test, make sure comment the "start()" function call in app.js
 * This is to make sure the mongo0se url is running twice
 */

const request = require("supertest");
const app = require("../server");
const User = require("../models/UserModel");
const Key = require("../models/KeyModel");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createToken } = require("../utils/token");

const userData = {
  email: "test@example.com",
  password: "password",
};

let mongoServer;
describe("Key API Endpoints", () => {
  let authToken;

  beforeAll(async () => {
    // Mock user data

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const adminUser = await User.create({
      email: "admin@example.com",
      password: "adminPassword",
    });

    adminUser.isVerified = true;
    adminUser.role = "admin";
    await adminUser.save();
    const adminToken = createToken({
      payload: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
    });

    // Register user
  }, 10000);

  afterAll(async () => {
    await mongoose.close;
    await mongoose.connection.close();
    mongoServer.stop();
  });

  describe("Creating Key", () => {
    it("should create a new key", async () => {
      const adminUser = await User.create({
        email: "user1@example.com",
        password: "adminPassword",
      });

      adminUser.isVerified = true;
      adminUser.role = "school";
      await adminUser.save();
      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
      const keyData = {
        keyName: "Test Key",
      };

      const response = await request(app)
        .post("/keys")
        .set("Authorization", `Bearer ${token}`)
        .send(keyData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "Key generated successfully"
      );
      expect(response.body).toHaveProperty("key");
    }, 10000);

    it("should return an error if the user is not logged in", async () => {
      // Make request without providing auth token
      const keyData = {
        keyName: "Test Key",
      };
      const response = await request(app)
        .post("/keys")
        .send(keyData)
        .expect(401);

      expect(response.body).toHaveProperty(
        "msg",
        "Authentication failed: Token missing"
      );
    });

    it("should return an error if an active key already exists for the user", async () => {
      // Create a user with role 'school'
      const user = await User.create({
        email: "user1223@example.com",
        password: "userPassword",
      });
      user.isVerified = true;
      await user.save();

      // Create an active key for the user
      await Key.create({
        keyName: "Active Key",
        key: "activeKey",
        user: user.id,
        status: "active",
      });

      const token = createToken({
        payload: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });

      const keyData = {
        keyName: "Test Key",
      };
      const response = await request(app)
        .post("/keys")
        .set("Authorization", `Bearer ${token}`)
        .send(keyData)
        .expect(400);

      expect(response.body).toHaveProperty("msg", "Active key already exists");
    });
  });
  describe("Get all keys", () => {
    it("should get all keys", async () => {
      const adminUser = await User.create({
        email: "admin1@example.com",
        password: "adminPassword",
      });

      adminUser.isVerified = true;
      adminUser.role = "admin";
      await adminUser.save();
      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
      const response = await request(app)
        .get("/keys")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("keys");
      expect(response.body.keys).toBeInstanceOf(Array);
    }, 10000);

    it("should return an error if no keys are found", async () => {
      // Create a regular user
      const user = await User.create({
        email: "user@example.com",
        password: "userPassword",
      });
      user.isVerified = true;
      user.role = "school";
      await user.save();

      // Log in regular user to get auth token
      const token = createToken({
        payload: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });

      const response = await request(app)
        .get("/keys")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty("msg", "No keys found");
    }, 10000);

    it("should return all keys for a user", async () => {
      // Create a regular user
      const user = await User.create({
        email: "userkeys@example.com",
        password: "userPassword",
      });
      user.isVerified = true;
      user.role = "school";
      await user.save();

      // Log in regular user to get auth token
      const token = createToken({
        payload: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });

      // Create some keys belonging to the user
      const key1 = await Key.create({
        keyName: "Key 1",
        key: "Something something",
        user: user.id,
      });
      key1.status = "revoked";
      await key1.save();
      const key2 = await Key.create({
        keyName: "Key 2",
        key: "Some key value",
        user: user.id,
      });

      // Make request to get all keys
      const response = await request(app)
        .get("/keys")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      // Assert response
      expect(response.body.keys).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe("Gets a single Key", () => {
    it("should get a single key by ID", async () => {
      const adminUser = await User.create({
        email: "admin1User@example.com",
        password: "adminPassword",
      });

      adminUser.isVerified = true;
      await adminUser.save();
      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
      const mockKey = await Key.create({
        keyName: "Mock Key",
        key: "mockKey",
        user: adminUser._id, // Generate a valid ObjectId
      });

      const response = await request(app)
        .get(`/keys/${mockKey._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("keyName", mockKey.keyName);
      expect(response.body).toHaveProperty("key", mockKey.key);
    }, 10000);

    it("should return an error if no key is found with the provided ID", async () => {
      // Create an admin user
      const adminUser = await User.create({
        email: "admin344@example.com",
        password: "adminPassword",
      });
      adminUser.isVerified = true;
      adminUser.role = "admin";
      await adminUser.save();

      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });

      const invalidId = "44333855utfjeu";
      const response = await request(app)
        .get(`/keys/${invalidId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty(
        "msg",
        `No item found with id : ${invalidId}`
      );
    });
  });
  describe("Search keys", () => {
    it("should search for a key by school email", async () => {
      const adminUser = await User.create({
        email: "admin11@example.com",
        password: "adminPassword",
      });

      adminUser.isVerified = true;
      adminUser.role = "admin";
      await adminUser.save();
      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
      // const email = "test@example.com";

      const response = await request(app)
        .post("/keys/email")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "admin1User@example.com" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("key");
    }, 10000);

    it("should return an error if no user is found with the provided email", async () => {
      // Create an admin user
      const adminUser = await User.create({
        email: "admin90@example.com",
        password: "adminPassword",
      });
      adminUser.role = "admin";
      adminUser.isVerified = true;
      await adminUser.save();

      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });

      const invalidEmail = "invalid@example.com"; // Assuming this email does not exist
      const response = await request(app)
        .post("/keys/email")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: invalidEmail })
        .expect(404);

      // Assert response
      expect(response.body).toHaveProperty(
        "msg",
        "No user found with this email"
      );
    });

    it("should return an error if no active key is found for the provided user email", async () => {
      // Create an admin user
      const adminUser = await User.create({
        email: "admin99870@example.com",
        password: "adminPassword",
      });
      adminUser.role = "admin";
      adminUser.isVerified = true;
      await adminUser.save();

      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });

      const schoolUser = await User.create({
        email: "schoossdil@example.com",
        password: "schoolPassword",
      });
      schoolUser.isVerified = true;

      const response = await request(app)
        .post("/keys/email")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: schoolUser.email })
        .expect(404);

      expect(response.body).toHaveProperty(
        "msg",
        "No active key found for this user"
      );
    });
  });
  describe("Revoke a key", () => {
    it("should revoke a key", async () => {
      const adminUser = await User.create({
        email: "admin112@example.com",
        password: "adminPassword",
      });

      adminUser.isVerified = true;
      adminUser.role = "admin";
      await adminUser.save();
      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
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
          .set("Authorization", `Bearer ${token}`);

        // Check if the response status code is 200 (OK)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual("key revoked!");
      } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.key) {
          expect(error.response.statusCode).toBe(409);
          expect(error.response.body).toHaveProperty(
            "message",
            "Key already revoked"
          );
        } else {
          throw error;
        }
      }
    });

    it("should return an error if no key is found with the provided id", async () => {
      const adminUser = await User.create({
        email: "admin14512@example.com",
        password: "adminPassword",
      });

      adminUser.isVerified = true;
      adminUser.role = "admin";
      await adminUser.save();
      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });

      // Make request to revoke a non-existing key
      const nonExistingKeyId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .patch(`/keys/revoke-key/${nonExistingKeyId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      // Assert response
      expect(response.body).toHaveProperty("msg", "No key found with this id");
    });
  });
});
