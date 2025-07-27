const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://i.pinimg.com/236x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg",
    },
} , {timestamps: true})
const User = mongoose.model('User', userSchema);
module.exports = User;