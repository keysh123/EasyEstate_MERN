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
const deleteUser = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id) {
            return next(errorHandler(403, "You can only delete your own account"));
        }
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return next(errorHandler(404, "User not found"));
        }

        res.clearCookie("access_token")

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
    catch (err) {
        next(err);
    }
}
module.exports = {
    updateUser,
    deleteUser
}
