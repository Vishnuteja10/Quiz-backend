const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      const passwordMatched = await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        res
          .status(400)
          .json({ success: false, message: "Invalid user or password" });
      } else {
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        res.status(200).json({
          success: true,
          message: "Login success",
          token,
          userId: user._id,
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid user or password" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { login, register };
