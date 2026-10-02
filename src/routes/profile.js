const express = require("express");

const { userAuth } = require("../middlewares/auth");
const { hashPassword } = require("../utils/password");

const {
  validateProfileEditData,
  validateProfilePasswordData,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile", userAuth, async (req, res) => {
  try {
    const updates = req.body;

    if (!validateProfileEditData(req)) {
      throw new Error("Invalid field provided in the update request");
    }

    const loggedInUser = req.user;

    Object.keys(updates).forEach((field) => {
      loggedInUser[field] = updates[field];
    });

    await loggedInUser.save();

    res.json({ message: "Profile updated successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    validateProfilePasswordData(req);
    console.log("password validation passed for user: ");
    const loggedInUser = req.user;

    const isCurrentPasswordValid = await loggedInUser.validatePassword(
      req.body.currentPassword,
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await hashPassword(req.body.newPassword);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
