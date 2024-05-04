/**
 * Authentication controller
 * Register
 * Verify email
 * Login
 * Forgot password
 * Reset password
 */

const User = require("../models/UserModel");
const { attachCookiesToResponse } = require("../utils/token");
const createHash = require("../utils/createHash");
const asyncHandler = require("../utils/asyncHandler");
const customError = require("../utils/customError");
const Token = require("../models/TokenModel");

const {
  sendEmailVerification,
  sendResetPasswordEmail,
} = require("../utils/email");
const crypto = require("crypto");
const userObject = require("../utils/userObject");

const register = asyncHandler(async (req, res, next) => {
  /**
   * Registration controller
   *@find:Finds if there is already an email in use
   @params:Takes email and password
   @return:Returns a success message telling user to verify email through an email message
   */
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
  await sendEmailVerification({
    email: user.email,
    verificationToken: user.verificationToken,
  });
  res.status(201).json({
    msg: "Success! Please check your email to verify account",
  });
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  /***
   * Email verification controller
   * @function:Verifies users account if token is valid
   * @params:Take token from sent email link
   * @return:Returns a message indicating a user is verified
   */
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return next(new customError("Verification Failed", 400));
    // return res.status(400).jso({"msg": "error wrong message"})
  }

  (user.isVerified = true), (user.verified = Date.now());
  user.verificationToken = "";

  await user.save();

  res.status(200).json({ msg: "Email Verified" });
});

const login = asyncHandler(async (req, res, next) => {
  /***
   * Login controller
   * @function:Logs user in
   * @prams:Takes email and password from body
   * @return:Returns user with jwt token if user is found in the database
   */
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new customError("Please provide all values", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new customError("Invalid Credentials", 401));
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new customError("Invalid credentials", 401));
  }

  const tokenUser = userObject(user);
  // create refresh token
  let refreshToken = "";
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      return next(customError("Invalid Credentials", 401));
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
});

const logout = asyncHandler(async (req, res, next) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  /**
   * Forgot password controller
   * @function:Allow user to get link to reset password
   * @params:Takes email from body and sends an email for user to reset the password
   */
  const { email } = req.body;
  if (!email) {
    return next(new customError("Please provide a valid email", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new customError("No email found for this user", 404));
  }

  const passwordToken = crypto.randomBytes(70).toString("hex");
  // send email.onrender.com`;
  await sendResetPasswordEmail({
    email: user.email,
    token: passwordToken,
  });

  const tenMinutes = 1000 * 60 * 10;
  const passwordTokenExpirationDate = Date.now() + tenMinutes;

  user.passwordToken = createHash(passwordToken);
  user.passwordTokenExpirationDate = passwordTokenExpirationDate;
  await user.save();
  res
    .status(200)
    .json({ msg: "Please check your email for reset password link" });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  /**
   * Reset password controller
   * @function:Allow user to reset forgotten password
   * @params:Take token, password from params and body respectively
   */
  const { password } = req.body;
  const { token } = req.params;
  if (!token || !password) {
    return next(new customError("Please provide all values", 400));
  }
  const user = await User.findOne({
    passwordToken: createHash(token),
    passwordTokenExpirationDate: { $gt: Date.now() },
  });
  if (!user) return next(new customError("Invalid token or has expired", 400));
  user.password = password;
  user.passwordToken = null;
  user.passwordTokenExpirationDate = null;
  console.log("Set the null values of password token and expiry date");
  await user.save();

  res.status(200).json({ msg: "Your password has being reset successfully!" });
});

const resendVerificationLink = asyncHandler(async (req, res, next) => {
  const { email } = req.params;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new customError("Incorrect email or not found!", 404));
  }
  const verificationToken = crypto.randomBytes(40).toString("hex");
  // send email.onrender.com`;
  await sendEmailVerification({
    email: email,
    verificationToken: verificationToken,
  });
  user.verificationToken = verificationToken;
  await user.save();

  return res.status(200).json({ msg: "Verification email link resent!" });
});

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "school" }).select("-password");
  res.status(200).json({ users, count: users.length });
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationLink,
  logout,
  getAllUsers,
};
