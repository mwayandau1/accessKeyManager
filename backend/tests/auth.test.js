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
const { sendEmailVerification } = require("../utils/email");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createToken } = require("../utils/token");

// Mock user data
const baseEmail = "test@example.com"; // Base email address
const timestamp = Date.now(); // Current timestamp

jest.mock("../utils/email");
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
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Register user
}, 10000);

afterAll(async () => {
  await mongoose.close;
  await mongoose.connection.close();
  mongoServer.stop();
});
describe("Authentication Controller", () => {
  describe("register", () => {
    it("should register a new user with valid email and password", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com", password: "password" });
      expect(response.status).toBe(201);
      expect(response.body.msg).toBe(
        "Success! Please check your email to verify account"
      );
    }, 10000);

    it("should return an error if email or password is missing", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ email: "", password: "" });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Please fill all values");
    }, 10000);

    it("should return an error for registering with an existing email", async () => {
      await request(app)
        .post("/auth/register")
        .send({ email: "mocked@example.com", password: "password123" });

      const response = await request(app)
        .post("/auth/register")
        .send({ email: "mocked@example.com", password: "password123" });
      expect(response.status).toBe(409);
      expect(response.body.msg).toBe("This email is already in use!");
    }, 10000);

    it("should register the first user as an admin", async () => {
      // Clean up existing users
      await User.deleteMany({});

      const response = await request(app)
        .post("/auth/register")
        .send({ email: "firstuser@example.com", password: "password" });
      expect(response.status).toBe(201);

      const user = await User.findOne({ email: "firstuser@example.com" });
      expect(user).not.toBeNull();
      expect(user.role).toBe("admin");
    }, 10000);

    it("should register subsequent users as school", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ email: "schooluser@example.com", password: "password" });
      expect(response.status).toBe(201);

      const user = await User.findOne({ email: "schooluser@example.com" });
      expect(user).not.toBeNull();
      expect(user.role).toBe("school");
    }, 10000);
  });

  describe("verifyEmail", () => {
    it("should verify email", async () => {
      await User.create(mockUser);

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
    it("should return an error if email is missing", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ password: "password123" })
        .expect(400);
      expect(response.body).toHaveProperty("msg", "Please provide all values");
    }, 10000);

    it("should return an error if password is missing", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com" })
        .expect(400);
      expect(response.body).toHaveProperty("msg", "Please provide all values");
    }, 10000);

    it("should return an error if user is not verified", async () => {
      await User.create({
        ...userData,
        email: "unverified@gmail.com",
        isVerified: false,
      });
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "unverified@gmail.com", password: "password" })
        .expect(403);
      expect(response.body).toHaveProperty(
        "msg",
        "Please verify your email to continue"
      );
    }, 10000);
    it("should return an error for incorrect password", async () => {
      await User.create({
        ...userData,
        email: "test4@gmail.com",
        isVerified: true,
      });
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test4@gmail.com", password: "wrongPassword" })
        .expect(401);
      expect(response.body).toHaveProperty("msg", "Invalid credentials");
    }, 10000);
  });

  describe("forgotPassword", () => {
    it("should send reset password email", async () => {
      await User.create({ ...mockUser, email: "testemamil@gmail.com" });

      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: mockUser.email })
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
        email: "testset@gmail.com",
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
        .expect(401);
      expect(response.body).toHaveProperty(
        "msg",
        "Invalid token or has expired"
      );
    }, 10000);
    it("should return an error if password is missing", async () => {
      const response = await request(app)
        .patch(`/auth/reset-password/mockPasswordToken`)
        .expect(400);
      expect(response.body).toHaveProperty("msg", "Please provide all values");
    }, 10000);

    it("should return an error if token is expired", async () => {
      // Create user with expired password token
      await User.create({
        ...mockUser,
        email: "expiredToken@example.com",
        isVerified: true,
        passwordToken: createHash("expiredToken"),
        passwordTokenExpirationDate: Date.now() - 600000,
      });

      const response = await request(app)
        .patch(`/auth/reset-password/expiredToken`)
        .send({ password: "new_password" })
        .expect(401);
      expect(response.body).toHaveProperty(
        "msg",
        "Invalid token or has expired"
      );
    }, 10000);
  });

  describe("resendVerificationLink", () => {
    it("should resend verification email for existing user", async () => {
      await User.create({ ...mockUser, email: "test@gmail.com" });
      const response = await request(app)
        .get(`/auth/resend-email/${mockUser.email}`)
        .expect(200);
      expect(response.body.msg).toBe("Verification email link resent!");
      expect(sendEmailVerification).toHaveBeenCalled();
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

  describe("getAllUsers", () => {
    it("should return all users with the role 'school'", async () => {
      // Create mock users with different roles
      const adminUser = await User.create({
        email: "admin@example.com",
        password: "adminPassword",
      });
      const schoolUser1 = await User.create({
        email: "school1@example.com",
        password: "schoolPassword",
      });
      const schoolUser2 = await User.create({
        email: "school2@example.com",
        password: "schoolPassword",
      });

      adminUser.isVerified = true;
      adminUser.role = "admin";
      await adminUser.save();
      // Log in user to get auth token
      // const loginResponse = await request(app)
      //   .post("/auth/login")
      //   .send({ email: adminUser.email, password: adminUser.password });
      // authToken = loginResponse.body.token;

      const token = createToken({
        payload: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
      const response = await request(app)
        .get("/auth/schools") // Corrected URL path
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);
      expect(Array.isArray(response.body.users)).toBe(true);

      // // Check if the response contains all school users and count matches
      // expect(response.body.users).toHaveLength(2);
      // expect(response.body.count).toBe(2);
      // expect(response.body.users[0]._id).toBe(schoolUser1._id.toString());
      // expect(response.body.users[1]._id).toBe(schoolUser2._id.toString());
    }, 10000);

    it("should return an error if no users with role 'school' exist", async () => {
      await User.deleteMany();
      // Create mock users with different roles
      const adminUser = await User.create({
        email: "admin2@example.com",
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
        .get("/auth/schools") // Corrected URL path
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty(
        "msg",
        "No users on the platform yet"
      );
    }, 10000);
  });
});
