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
  getSingleKeyById,
  searchKeyBySchoolEmail,
} = require("../controllers/keyControllers");

router.post("/", authenticateUser, createKey);
router.get("/", authenticateUser, getAllKeys);
router.get("/:id", authenticateUser, getSingleKeyById);
router.patch(
  "/revoke-key/:id",
  authenticateUser,
  authorizePermissions("admin"),
  revokedAccessKey
);
router.post(
  "/school/:email",
  authenticateUser,
  authorizePermissions("admin"),
  searchKeyBySchoolEmail
);
module.exports = router;
