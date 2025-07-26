require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectToDB = require('./db/db');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const authRouter = require('./routes/authRouter');



app.use(cors());
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/auth', authRouter);


connectToDB();
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});