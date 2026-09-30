const bcrypt = require("bcrypt");
const express = require("express");
const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");

const app = express();
const User = require("./models/user");

app.use(express.json());

// Create a new user
// POST /signup
app.post("/signup", async (req, res) => {
  console.log("Req : ", req.body);

  try {
    // Validate the sign-up data
    validateSignUpData(req);

    const { password } = req.body;
    // Encrypt the password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // req.body.password = hashedPassword;

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
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});

// Get user by email
// GET /user/:email
app.get("/user/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ emailId: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" + error.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" + error.message });
  }
});

app.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "password",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(updateData).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );

    if (!isUpdateAllowed) {
      throw new Error("Invalid update fields");
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      runValidators: true,
      returnDocument: "after",
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" + error.message });
  }
});

// Get all users
// GET /feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" + error.message });
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
