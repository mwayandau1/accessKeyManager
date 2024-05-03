/**
 * Key Model(Entity)
 * fields:Key name, key, user, status, procurement date, expiry date,
 */

const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
  keyName: {
    type: String,
    required: true,
  },
  key: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["active", "expired", "revoked"],
    default: "active",
  },
  procurementDate: { type: Date, default: Date.now },
  expiryDate: {
    type: Date,
    default: () => Date.now() + 30 * 24 * 60 * 60 * 1000,
  },
});

keySchema.index({ key: 1 }, { unique: true });
keySchema.index({ user: 1 });
keySchema.index({ status: 1 });

keySchema.virtual("isExpired").get(function () {
  return this.status === "expired" || this.expiryDate < Date.now();
});

module.exports = mongoose.model("Key", keySchema);
