const express = require('express');
const { register, login  , google , logout} = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Auth route is working');
});
router.post('/register', register);
router.post('/login', login);
router.post('/google', google)
router.post('/logout', logout);





module.exports = router;

