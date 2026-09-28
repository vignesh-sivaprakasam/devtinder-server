const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");

app.use(express.json());

// Create a new user
// POST /signup
app.post("/signup", async (req, res) => {
  console.log("Req : ", req.body);

  try {
    // Creating a new instance of the User model and saving it to the database
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).json({ message: "Error saving user" });
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
    res.status(500).json({ message: "Error fetching user" });
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
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

app.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    console.log("update Data : ", updateData);
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      runValidators: true,
      returnDocument: "after",
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Updated User:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// Get all users
// GET /feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
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
