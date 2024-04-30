const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/UserModel");

// Mock user data
const baseEmail = "test@example.com"; // Base email address
const timestamp = Date.now(); // Current timestamp
const uniqueEmail = `${baseEmail}_${timestamp}@example.com`; // Unique email address

const userData = {
  email: "test@example.com",
  password: "password",
};

// Mock user object
const mockUser = {
  ...userData,
  role: "school", // or "admin"
  verificationToken: "mockVerificationToken",
};

// Mock MongoDB connection before running tests
beforeAll(async () => {
  await mongoose.connect(
    "mongodb+srv://ayandau:moses21311@nodeexpress.4nrmugq.mongodb.net/testAccessKeyManager"
  );
}, 10000);

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
        .send(userData)
        .expect(201);
      expect(response.body).toHaveProperty(
        "msg",
        "Success! Please check your email to verify account"
      );
    });
  });

  describe("verifyEmail", () => {
    it("should verify email", async () => {
      await User.create(mockUser);
      const response = await request(app)
        .get(`/auth/verify-email/${mockUser.verificationToken}`)
        .expect(200);
      expect(response.body).toHaveProperty("msg", "Email Verified");
    });
  });

  describe("login", () => {
    it("should log in an existing user", async () => {
      await User.create(mockUser);
      const response = await request(app)
        .post("/auth/login")
        .send(userData)
        .expect(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("forgotPassword", () => {
    it("should send reset password email", async () => {
      await User.create(mockUser);
      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: userData.email })
        .expect(200);
      expect(response.body).toHaveProperty(
        "msg",
        "Please check your email for reset password link"
      );
    });
  });

  describe("resetPassword", () => {
    it("should reset password", async () => {
      const newPassword = "new_password";
      const newPasswordToken = "mockPasswordToken"; // generate a mock token for reset password
      // Create user with password token
      await User.create({
        ...mockUser,
        passwordToken: newPasswordToken,
        passwordTokenExpirationDate: Date.now() + 600000,
      }); // expires in 10 minutes

      const response = await request(app)
        .patch(`/auth/reset-password/${newPasswordToken}`)
        .send({ password: newPassword })
        .expect(200);
      expect(response.text).toBe("Your password has being reset successfully!");
    });
  });
});
