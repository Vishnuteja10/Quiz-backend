const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");

const app = express.Router();

app.use(cors());
app.use(express.json());

const VerifyAuthentication = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.json({
        success: false,
        message: "User not authenticated, Please login first!",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

module.exports = VerifyAuthentication;
