/**
 *
 * Before you run the test, make sure comment the "start()" function call in app.js
 * This is to make sure the mongo0se url is running twice
 */

const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const createHash = require("../utils/createHash");

// Mock user data
const baseEmail = "test@example.com"; // Base email address
const timestamp = Date.now(); // Current timestamp

const userData = {
  email: "tes2t@example.com",
  password: "password",
};

// Mock user object
const mockUser = {
  role: "school", // or "admin"
  verificationToken: "mockVerificationToken",
  email: "mocked@exmaple.com",
  password: "password222",
};

// Mock MongoDB connection before running tests
beforeAll(async () => {
  await mongoose.connect(
    "mongodb+srv://ayandau:moses21311@nodeexpress.4nrmugq.mongodb.net/testAccessKeyManager"
  );
  await User.create(mockUser);
}, 15000);

// Clean up mock data after running tests
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("Authentication Controller", () => {
  describe("register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/auth/register")
        .type("json")
        .send(userData);
      expect(response.status).toBe(201);
      expect(response.body.msg).toBe(
        "Success! Please check your email to verify account"
      );
    }, 10000);

    it("should return an error for registering with existing email", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ email: mockUser.email, password: "password123" })
        .expect(400);
      expect(response.body).toHaveProperty(
        "msg",
        "This email is already in use!"
      );
    }, 10000);
  });

  describe("verifyEmail", () => {
    it("should verify email", async () => {
      const response = await request(app)
        .get(`/auth/verify-email/${mockUser.verificationToken}`)
        .expect(200);
      expect(response.body).toHaveProperty("msg", "Email Verified");
    }, 10000);
  });

  describe("login", () => {
    it("should log in an existing user", async () => {
      await User.create({
        ...userData,
        email: "test3@gmail.com",
        isVerified: true,
      });
      const response = await request(app)
        .post("/auth/login")
        .send({ ...userData, email: "test3@gmail.com" })
        .expect(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
    }, 10000);

    it("should return an error for invalid login credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "nonexistent@example.com", password: "invalidPassword" })
        .expect(401);
      expect(response.body).toHaveProperty("msg", "Invalid Credentials");
    }, 10000);
  });

  describe("forgotPassword", () => {
    it("should send reset password email", async () => {
      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: userData.email })
        .expect(200);
      expect(response.body.msg).toBe(
        "Please check your email for reset password link"
      );
    }, 10000);

    it("should return an error for non-existing email", async () => {
      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "nonexistent@example.com" })
        .expect(404);
      expect(response.body).toHaveProperty(
        "msg",
        "No email found for this user"
      );
    }, 10000);
  });

  describe("resetPassword", () => {
    it("should reset password", async () => {
      const newPassword = "new_password";
      const newPasswordToken = "mockPasswordToken"; // generate a mock token for reset password
      // Create user with password token
      await User.create({
        ...mockUser,
        email: "test4@gmail.com",
        isVerified: true,
        passwordToken: createHash(newPasswordToken),
        passwordTokenExpirationDate: Date.now() + 600000,
      });

      const response = await request(app)
        .patch(`/auth/reset-password/${newPasswordToken}`)
        .send({ password: newPassword })
        .expect(200);
      expect(response.body.msg).toBe(
        "Your password has being reset successfully!"
      );
    }, 10000);
    it("should return an error for invalid reset password token", async () => {
      const response = await request(app)
        .patch(`/auth/reset-password/invalidToken`)
        .send({ password: "new_password" })
        .expect(400);
      expect(response.body).toHaveProperty(
        "msg",
        "Invalid token or has expired"
      );
    }, 10000);
  });
  describe("resendVerificationLink", () => {
    it("should resend verification email for existing user", async () => {
      const response = await request(app)
        .get(`/auth/resend-email/${mockUser.email}`)
        .expect(200);
      expect(response.body.msg).toBe("Verification email link resent!");
    }, 10000);

    it("should return an error for non-existing user", async () => {
      const response = await request(app)
        .get(`/auth/resend-email/nonexistent@example.com`)
        .expect(404);
      expect(response.body).toHaveProperty(
        "msg",
        "Incorrect email or not found!"
      );
    }, 10000);
  });
});
