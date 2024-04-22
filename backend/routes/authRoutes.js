const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../utils/authenticate");

const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", authenticateUser, logout);
router.get("/verify-email", verifyEmail);
router.patch("/reset-password/:token/:email", resetPassword);

router.post("/forgot-password", forgotPassword);

module.exports = router;
