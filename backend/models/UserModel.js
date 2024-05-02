/**
 * User model(Entity)
 * fields:email, password, role, verificationToken, isVerified, verified, passwordToken,  passwordTokenExpirationDate
 */

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter your email address"],
    maxlength: 100,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    },
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "school"],
    default: "school",
  },

  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatched = await bcrypt.compare(userPassword, this.password);
  return isMatched;
};

module.exports = mongoose.model("User", UserSchema);
