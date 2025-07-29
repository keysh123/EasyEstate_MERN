const express = require('express');
const router = express.Router();
const { createListing } = require('../controllers/listingController');
const { verifyToken } = require('../utils/verification');

router.post('/create', verifyToken, createListing);



module.exports = router;