require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Week 3 Backend API is running"
  });
});
// Update user
app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message
    });
  }
});
// Get users from MongoDB
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
});
// Create user
app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const newUser = await User.create({
      name,
      email
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message
    });
  }
});
// Delete user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User deleted successfully",
      user: deletedUser
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message
    });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});