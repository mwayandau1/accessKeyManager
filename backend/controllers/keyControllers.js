const Key = require("../models/KeyModel");
const generateKey = require("../utils/generateKey");
const customError = require("../utils/customError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/UserModel");

const createKey = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { keyName } = req.body;
  if (!userId) {
    return next(new customError("Please login to continue", 400));
  }
  // Check if there's already an active key for the user
  const activeKey = await Key.findOne({ user: userId, status: "active" });
  if (activeKey) {
    return next(new customError("Active key already exists", 400));
  }

  // Generate a new key
  const key = generateKey();
  const newKey = new Key({ keyName, key, user: userId });
  await newKey.save();
  res.status(201).json({ message: "Key generated successfully", key });
});

const getAllKeys = asyncHandler(async (req, res, next) => {
  const { active, revoked, expired } = req.params;
  if (req.user.role !== "admin") {
    let keys = await Key.find({ user: req.user.id });
    if (active) keys = keys.active;
    if (revoked) keys = keys.revoked;
    if (expired) keys = keys.expired;
    if (!keys) return next(new customError("No keys found with this id", 404));
    return res.status(200).json({ keys, count: keys.length });
  } else {
    let keys = await Key.find({});
    if (active) keys = keys.active;
    if (revoked) keys = keys.revoked;
    if (expired) keys = keys.expired;
    if (!keys) return next(new customError("No keys found with this id", 404));

    return res.status(200).json({ keys, count: keys.length });
  }
});

const getKeysBySchoolEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const userId = user.id;
  const keys = Key.findById(userId);
  return res.status(200).json({ keys, count: keys.length });
});

const revokedAccessKey = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const key = await Key.findById(id);
  if (!key) return next(new customError("No key found with this id", 404));
  key.status = "revoked";
  await key.save();
  return res.status(200).json("key revoked!");
});

module.exports = {
  createKey,
  revokedAccessKey,
  getAllKeys,
  getKeysBySchoolEmail,
};
