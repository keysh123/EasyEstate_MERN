const express = require('express');
const { updateUser , deleteUser } = require('../controllers/userController');
const {verifyToken} = require('../utils/verification');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('User route is working');
});
router.put('/update', verifyToken, updateUser);
router.delete('/delete', verifyToken, deleteUser);


module.exports = router;

