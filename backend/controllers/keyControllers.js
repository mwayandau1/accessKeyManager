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
  console.log("hitting the all route");
  if (req.user.role !== "admin") {
    const keys = await Key.find({ user: req.user.id });

    if (!keys) return next(new customError("No keys found with this id", 404));
    return res.status(200).json({ keys, count: keys.length });
  } else {
    const { email } = req.query;
    if (email) {
      const user = await User.findOne({ email });
      if (!user)
        return next(new customError("No user found with this email", 404));
      const userId = user.id;
      const keys = await Key.find({ user: userId });
      if (!keys)
        return next(new customError("No keys found for this user", 404));
      return res.status(200).json({ keys, count: keys.length });
    }
    const keys = await Key.find({});

    if (!keys) return next(new customError("No keys found with this id", 404));

    return res.status(200).json({ keys, count: keys.length });
  }
});

const getSingleKeyById = asyncHandler(async (req, res, next) => {
  console.log("Single key by id");
  const { id } = req.params;
  const key = await Key.findById(id);
  console.log("found single key by id", key);
  if (!key) return next(new customError("No key found with this id", 404));
  console.log(key);
  return res.status(200).json(key);
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
  getSingleKeyById,
};
