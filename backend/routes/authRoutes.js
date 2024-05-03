/**
 * Authentication route for the login, register, reset password, forgot password and verify email
 *
 */

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationLink,
} = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.patch("/reset-password/:token", resetPassword);

router.post("/forgot-password", forgotPassword);
router.get("/resend-email/:email", resendVerificationLink);

module.exports = router;
