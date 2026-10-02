const express = require("express");

const { validateSignUpData } = require("../utils/validation");
const { hashPassword } = require("../utils/password");
const User = require("../models/user");

const authRouter = express.Router();

// Create a new user
// POST /signup
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the sign-up data
    validateSignUpData(req);

    const { password } = req.body;
    const hashedPassword = await hashPassword(password);

    // Creating a new instance of the User model and saving it to the database
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: hashedPassword,
      age: req.body.age,
      gender: req.body.gender,
      photoUrl: req.body.photoUrl,
      about: req.body.about,
      skills: req.body.skills,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      // Create a JWT token.
      const token = await user.getJWT();

      // Add the token to the response header or body as needed.
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36_00_000),
      });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()), // Set the cookie to expire in the past
    });

    res.send("Logout successful");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});

module.exports = authRouter;
