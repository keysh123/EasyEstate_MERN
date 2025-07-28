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
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(errorHandler(400, "Email and password are required"));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(errorHandler(401, "Invalid credentials"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { password: userPassword, ...userWithoutPassword } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        }).status(200).json({
            success: true,
            message: "Login successful",
            user: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
};
const google = async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase();
    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password, ...userWithoutPassword } = user._doc;
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "lax",
        })
        .status(200)
        .json({ success: true, message: "Login successful", user: userWithoutPassword });
    }

    const generatedUsername = req.body.name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUser = new User({
      username: generatedUsername,
      email,
      profilePicture: req.body.picture,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { password, ...userWithoutPassword } = newUser._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
    }).status(201).json({
      success: true,
      message: "User registered and logged in successfully",
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};
const logout = async(req, res, next) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}

module.exports = {
  register,
  login,
   google,
  logout
};
