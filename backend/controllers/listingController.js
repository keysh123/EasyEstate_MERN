const { errorHandler } = require("../utils/error");
const mongoose = require("mongoose");
const Listing = require("../models/listingModel");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (err) {
    next(err);
  }
};

const getUserListing = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      userRef: new mongoose.Types.ObjectId(req.user),
    });

    res.status(200).json({
      success: true,
      message: "User listings fetched successfully",
      listings,
    });
  } catch (err) {
    next(err);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(403, "You can only delete your own listings"));
    }

    await Listing.findByIdAndDelete(listingId);

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const editListing = async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(403, "You can only edit your own listings"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (err) {
    next(err);
  }
};
const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "userRef",
      "email username"
    );
    if (!listing) {
      next(errorHandler(404, "No such listing"));
    }
    console.log(listing);

    res.status(200).json({
      success: true,

      listing,
    });
  } catch (err) {
    next(err);
  }
};
const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === false) {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === false) {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === false) {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }
    const searchTerm = req.query.searchTerm || "";

    let sortField = "createdAt";
    let sortOrder = "desc";

    const sortBy = req.query.sortBy;

    if (sortBy === "low-high") {
      sortField = "price";
      sortOrder = "asc";
    } else if (sortBy === "high-low") {
      sortField = "price";
      sortOrder = "desc";
    } else {
      sortField = "createdAt";
      sortOrder = "desc";
    }

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      // description : { $regex : searchTerm , $options : 'i'},
      // address : { $regex : searchTerm , $options : 'i'},
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sortField]: sortOrder,
      })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json({
      success: true,
      listings,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createListing,
  getUserListing,
  deleteListing,
  editListing,
  getListing,
  getListings,
};
