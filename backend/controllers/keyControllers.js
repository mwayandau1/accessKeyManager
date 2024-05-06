/**
 * Key controller
 * Create key, get all keys, get a single key, search a key and revoke a key
 */

const Key = require("../models/KeyModel");
const generateKey = require("../utils/generateKey");
const customError = require("../utils/customError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/UserModel");

const createKey = asyncHandler(async (req, res, next) => {
  /**
   * Create key controller
   * @function:Allows user to generate a new key
   * @login:User must login to generate a key
   * @active:User must not get a key there is already an active key
   * @return:Returns a new key generated by the user
   */
  const userId = req.user.id;
  const { keyName } = req.body;
  if (!userId) {
    return next(new customError("Please login to continue", 401));
  }
  const activeKey = await Key.findOne({ user: userId, status: "active" });
  if (activeKey) {
    return next(new customError("Active key already exists", 400));
  }

  const key = generateKey();
  const newKey = new Key({ keyName, key, user: userId });
  await newKey.save();
  res.status(201).json({ message: "Key generated successfully", newKey });
});

const getAllKeys = asyncHandler(async (req, res, next) => {
  /**
   * All keys controller
   * @function:Displays all keys generated on the platform
   * @login:User or admin must login to see all keys
   * @admin:Admin can see all keys generated on the platform including the status, date created, and expiry date
   * @user:User can only see keys generated by himself or herself
   * @return:Return all keys
   */
  try {
    let query = {};

    if (req.user.role !== "admin") {
      query.user = req.user.id;
    }

    const keys = await Key.find(query)
      .populate("user", "email")
      .sort({ procurementDate: -1 });

    if (!keys || keys.length === 0) {
      return next(new customError("No keys found", 404));
    }

    return res.status(200).json({ keys, count: keys.length });
  } catch (error) {
    return next(error);
  }
});

const getSingleKeyById = asyncHandler(async (req, res, next) => {
  /**
   * Single key controller
   * @function:Gets a single key by the id
   * @params:Takes key id and search for key
   * @Admin or user must login
   * @return:Returns a single by id
   */
  const { id } = req.params;

  // Find the key by ID and populate the 'user' field with the 'email' field
  const key = await Key.findById(id).populate("user", "email");

  if (!key) return next(new customError("No key found with this id", 404));

  const keyData = {
    keyName: key.keyName,
    key: key.key,
    user: key.user,
    email: key.user.email, // Access the email directly from the populated 'user' field
    status: key.status,
    procurementDate: key.procurementDate,
    expiryDate: key.expiryDate,
  };

  return res.status(200).json(keyData);
});

const revokedAccessKey = asyncHandler(async (req, res, next) => {
  /**
   * @function:Allows an admin to revoke key
   * @login:Admin must login
   * @params:Takes an id and gets single key
   * @return:Returns the revoked key
   */
  const { id } = req.params;
  const key = await Key.findById(id);
  if (!key) return next(new customError("No key found with this id", 404));
  key.status = "revoked";
  await key.save();
  return res.status(200).json("key revoked!");
});

const searchKeyBySchoolEmail = asyncHandler(async (req, res, next) => {
  /**
   * @function:allows an admin to search for key using school email address
   * @login:admin must login
   * @return:Returns key if found with the email
   *
   */
  const { email } = req.body;
  if (email) {
    const user = await User.findOne({ email });
    if (!user)
      return next(new customError("No user found with this email", 404));
    const userId = user.id;
    const key = await Key.find({ user: userId, status: "active" });
    if (!key || key.length === 0)
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
