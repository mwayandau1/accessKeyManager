const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../utils/authenticate");
const {
  createKey,
  getAllKeys,
  revokedAccessKey,
} = require("../controllers/keyControllers");

router.post("/", authenticateUser, createKey);
router.get("/", authenticateUser, getAllKeys);
router.patch(
  "/revoke-key/:id",
  authenticateUser,
  authorizePermissions("admin"),
  revokedAccessKey
);

module.exports = router;
