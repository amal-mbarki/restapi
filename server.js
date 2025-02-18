require("dotenv").config();  
const express = require("express");  
const mongoose = require("mongoose");  

const app = express();  
const PORT = process.env.PORT || 5000;  

app.use(express.json()); 

const User = require("./models/User");

// Get all users (GET)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Add a new user (POST)
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: "Error adding user" });
  }
});

// Update a user by ID (PUT)
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: "Error updating data" });
  }
});

// Delete a user by ID (DELETE)
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
});


// Connect to the database  
mongoose  
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })  
  .then(() => console.log("Successfully connected to the database"))  
  .catch((err) => console.error("Failed to connect to the database", err));  
  
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));  
