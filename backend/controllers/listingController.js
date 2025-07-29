const { errorHandler } = require("../utils/error");
const Listing = require('../models/listingModel');
const createListing = async (req, res , next) => {
    try{
        const listing = await Listing.create(req.body);
        res.status(201).json({
            success: true,
            message: "Listing created successfully",
            listing: listing
        });

    }
    catch(err){
        next(err);
    }
}
module.exports = {
    createListing
}