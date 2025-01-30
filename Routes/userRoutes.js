const express = require("express");
const joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../Schemas/userSchema");
const User = new mongoose.model("User", userSchema);
const userSchemaValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});
// routes

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "Data successfully fetched ", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get user by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json({ message: "Data successfully fetched ", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add new user
router.post("/", async (req, res) => {
  const { error } = userSchemaValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(201)
      .json({ message: "User added successfully", newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;