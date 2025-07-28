const jwt = require('jsonwebtoken');
const { errorHandler } = require("../utils/error");
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return next(errorHandler(401, "Access denied. No token provided."));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
             return next(errorHandler(403, "Access denied. token provided Invalid."));
        }
        req.user = user;
        next();
    });
}

module.exports = {
    verifyToken,
}