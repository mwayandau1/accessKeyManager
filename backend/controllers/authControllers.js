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
    return next(new customError("Please fill all values", 400));
  }
  const userAlreadyExist = await User.findOne({ email });
  if (userAlreadyExist) {
    return next(new customError("This email is already in use!", 400));
  }
  //Want to set the first user to register as Admin
  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "school";
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    email,
    password,
    role,
    verificationToken,
  });
  // const origin = "http://localhost:5000";
  const origin = `${req.protocol}://${req.get("host")}`;
  console.log(origin);

  await sendEmailVerification({
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(201).json({
    msg: "Success! Please check your email to verify account",
  });
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  console.log("Here");
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return next(new customError("Verification Failed", 400));
  }

  if (user.verificationToken !== token) {
    return next(new customError("Verification Failed", 400));
  }

  (user.isVerified = true), (user.verified = Date.now());
  user.verificationToken = "";

  await user.save();

  res.status(200).json({ msg: "Email Verified" });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new customError("Please provide all values", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new customError("Invalid Credentials", 400));
  }

  if (user.isVerified === false) {
    return next(new customError("Please verify your email to continue", 400));
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new customError("Invalid credentials", 400));
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

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new customError("Please provide a valid email", 400));
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    const origin = `${req.protocol}://${req.get("host")}`;
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = Date.now() + tenMinutes;

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(200)
    .json({ msg: "Please check your email for reset password link" });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;
  if (!token || !password) {
    return next(new customError("Please provide all values", 400));
  }
  const user = await User.findOne({
    passwordToken: createHash(token),
    passwordTokenExpirationDate: { $gt: Date.now() },
  });
  if (!user) return next(new customError("Invalid token or has expired"));
  user.password = password;
  user.passwordToken = null;
  user.passwordTokenExpirationDate = null;
  console.log("Set the null values of password token and expiry date");
  await user.save();

  res.send("Your password has being reset successfully!");
});

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
