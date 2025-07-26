const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error");

const register = async (req, res,next) => {
    try {
    const {username , email, password } = req.body;
    if (!username || !email || !password) {
        return next(errorHandler(400, "All fields are required"));    
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password : hashedPassword });
    await newUser.save();
    res.status(201).json({ success : true, message: "User registered successfully" });
    }
    catch (error) {
        next(error);
    }
};
const login = async (req, res) => {};

module.exports = {
  register,
  login,
};
