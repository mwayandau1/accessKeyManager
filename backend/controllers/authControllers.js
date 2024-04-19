const User = require("../models/UserModel");
// const obtainTokenUser = require("../utils/tokenUser");
const { createToken } = require("../utils/token");
const createHash = require("../utils/createHash");
const asyncHandler = require("../utils/asyncHandler");
const customError = require("../utils/customError");

const {
  sendEmailVerification,
  sendResetPasswordEmail,
} = require("../utils/email");
const crypto = require("crypto");

const register = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json("Please fill all values");
  }
  const userAlreadyExist = await User.findOne({ email });
  if (userAlreadyExist) {
    return res.status(400).json("This email is already in use!");
  }
  //Want to set the first user to register as Admin
  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    email,
    password,
    role,
    verificationToken,
  });
  const origin = "http://localhost:5000";

  await sendEmailVerification({
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(201).json({
    msg: "Success! Please check your email to verify account",
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token, email } = req.query;
  const user = await User.findOne({ email });
  console.log(req.query);

  if (!user) {
    res.status(400).json("Verification Failed");
  }

  if (user.verificationToken !== token) {
    res.status(400).json("Verification Failed");
  }

  (user.isVerified = true), (user.verified = Date.now());
  user.verificationToken = "";

  await user.save();

  res.status(200).json({ msg: "Email Verified" });
});

const login = asyncHandler(async (req, res) => {
  console.log("Testing forgot password");
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide all values" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    console.log("User not found");
    return res.status(400).json({ error: "Invalid Credentials" });
  }

  if (user.isVerified === false) {
    return res
      .status(400)
      .json({ error: "Please verify your email to continue" });
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = createToken({
    payload: { id: user.id, email: user.email, role: user.role },
  });

  // Return success response with user data
  res.status(200).json({ user: user, token });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });
  res.send("logout");
});

const forgotPassword = asyncHandler(async (req, res) => {
  console.log("Got to forgot password endpoint");
  const { email } = req.body;
  if (!email) {
    return res.status(400).json("Please provide a valid email");
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    const origin = "http://localhost:5000";
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(200)
    .json({ msg: "Please check your email for reset password link" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token, email } = req.query;
  if (!token || !email || !password) {
    return res.status(400).json("Please provide all values");
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.send("reset password");
});

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
