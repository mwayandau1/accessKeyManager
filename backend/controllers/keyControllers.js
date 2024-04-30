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
  const activeKey = await Key.findOne({ user: userId, status: "active" });
  if (activeKey) {
    return next(new customError("Active key already exists", 400));
  }

  const key = generateKey();
  const newKey = new Key({ keyName, key, user: userId });
  await newKey.save();
  res.status(201).json({ message: "Key generated successfully", key });
});

const getAllKeys = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    const keys = await Key.find({ user: req.user.id }).sort({ createdAt: -1 });

    if (!keys) return next(new customError("No keys found ", 404));
    return res.status(200).json({ keys, count: keys.length });
  } else {
    const keys = await Key.find({}).sort({ createdAt: -1 });

    if (!keys) return next(new customError("No keys found", 404));

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
  const userId = key.user;
  const user = await User.findById(userId);
  const email = user.email;
  const keyData = {
    keyName: key.keyName,
    key: key.key,
    user: key.user,
    email: email,
    status: key.status,
    procurementDate: key.procurementDate,
    expiryDate: key.expiryDate,
  };
  return res.status(200).json(keyData);
});

const revokedAccessKey = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const key = await Key.findById(id);
  if (!key) return next(new customError("No key found with this id", 404));
  key.status = "revoked";
  await key.save();
  return res.status(200).json("key revoked!");
});

const searchKeyBySchoolEmail = asyncHandler(async (req, res, next) => {
  console.log("entered here");
  const { email } = req.body;
  console.log(email);
  if (email) {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user)
      return next(new customError("No user found with this email", 404));
    const userId = user.id;
    console.log(userId);
    const key = await Key.find({ user: userId, status: "active" });
    if (!key)
      return next(new customError("No active key found for this user", 404));
    return res.status(200).json({ key });
  }
});

module.exports = {
  createKey,
  revokedAccessKey,
  getAllKeys,
  getSingleKeyById,
  searchKeyBySchoolEmail,
};
