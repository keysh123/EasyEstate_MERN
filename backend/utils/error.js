 const errorHandler = (statusCode , message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    error.isOperational = true; // This is an operational error, not a programming error
    return error;  
}
module.exports = {
    errorHandler
}