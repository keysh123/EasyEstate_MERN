const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI;

const connectToDB = async () => {
    mongoose.connect(dbURI, {
        useNewUrlParser: true,  
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
}
module.exports = connectToDB;