const express = require('express');
const router = express.Router();
const { createListing , getUserListing , deleteListing , editListing , getListing , getListings } = require('../controllers/listingController');
const { verifyToken } = require('../utils/verification');
router.get('/get',getListings)
router.post('/create-listing', verifyToken, createListing);
router.get('/get-listing', verifyToken, getUserListing);
router.delete('/delete-listing/:id', verifyToken, deleteListing);
router.put('/edit-listing/:id', verifyToken, editListing);

router.get('/:id',getListing)





module.exports = router;