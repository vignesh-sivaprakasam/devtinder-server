const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const express = require("express");

const { userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");

const app = express();
const User = require("./models/user");

app.use(express.json());
app.use(cookieParser());

const SECRET_KEY = "DEV@TINDER$123";

// Create a new user
// POST /signup
app.post("/signup", async (req, res) => {
  try {
    // Validate the sign-up data
    validateSignUpData(req);

    const { password } = req.body;
    // Encrypt the password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      // Create a JWT token.
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "7d",
      });

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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send(req.user.firstName + " sent connection request");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
