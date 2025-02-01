const express = require("express");
const joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../Schemas/userSchema");
const bcrypt = require("bcrypt");
const userSchemaValidation = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
  cartItem: joi.array(),
});

// middleware
// hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
// method to compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = new mongoose.model("User", userSchema);
// routes

// get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "Data successfully fetched ", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get user by username and password
router.get("/", async (req, res) => {
  const { username, password } = req.body;
  const isExist = await User.findOne({ username });
  if (!isExist) {
    return res.status(400).json({ message: "User not found" });
  }
  try {
    const isMatched = await isExist.comparePassword(password);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "User successfully logged in" });
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
    const { username, password } = req.body;
    const isExist = await User.findOne({ username });
    if (isExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "User added successfully", newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// update user info
router.put("/:username", async (req, res) => {
  try {
    const {username} = req.params.username;
    const { id } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      username,
      {
        $addToSet: {
          cartItem: id,
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "Item successfully added to the cart", updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
