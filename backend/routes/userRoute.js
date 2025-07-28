const express = require('express');
const { updateUser } = require('../controllers/userController');
const {verifyToken} = require('../utils/verification');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('User route is working');
});
router.put('/update', verifyToken, updateUser);


module.exports = router;

