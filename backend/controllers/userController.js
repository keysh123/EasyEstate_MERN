const User = require('../models/userModel');

const updateUser = async (req, res ,next) => {
    try{
        const {username,email,profilePicture } = req.body;
        const userId = req.user; // Assuming user ID is stored in req.user
        if (!username || !email) {
            return next(errorHandler(400, "Username and email are required"));
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId.id, // Accessing the ID from the user object
            { username, email, profilePicture },
            { new: true }
            
        );
        const { password, ...userWithoutPassword } = updatedUser._doc; // Exclude password from response
        if (!updatedUser) {
            return next(errorHandler(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: userWithoutPassword
        });
      
        

    }
    catch(err){
        next(err);
    }
}
module.exports = {
    updateUser,
}
