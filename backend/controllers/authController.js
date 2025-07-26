const User = require("../models/userModel");

const register = async (req, res) => {
    try {
    const {username , email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });    
    }
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
        return res.status(400).json({ message: "User already exists" });    
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
const login = async (req, res) => {};

module.exports = {
  register,
  login,
};
