require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectToDB = require('./db/db');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const authRouter = require('./routes/authRouter');



app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    status: statusCode, 
    message: message,
   })

});


connectToDB();
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});