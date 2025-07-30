import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getListings, deleteListing } from "../services/myListingSlice";
import DialogBox from "../components/DialogBox";
import { useLocation , useNavigate } from "react-router-dom";

const Listings = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { listings, error, loading } = useSelector((state) => state.myListing);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  useEffect(() => {
    if (!listings) {
      dispatch(getListings());
    }
  }, [dispatch, listings]);

  const handleEdit = (listing) => {
    // console.log("Edit", id);
    navigate("/create-listing", { state: { listing } });

  };

  const handleDelete = (id) => {
    setListingToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (listingToDelete) {
      dispatch(deleteListing(listingToDelete));
      setListingToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">My Listings</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {listings && listings.length === 0 && <p>No listings found.</p>}

      {listings &&
        listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={listing?.imageUrls?.[0] || "https://via.placeholder.com/80"}
                alt={listing.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-semibold">{listing.name}</h3>
                <p className="text-sm text-gray-600">
                  {listing.type} • ₹{listing.price}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(listing)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(listing._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      {/* ✅ Delete confirmation dialog */}
      {showDeleteDialog && (
        <DialogBox
          title="Confirm Delete"
          message="Are you sure you want to delete this listing?"
          onClose={() => {
            setShowDeleteDialog(false);
            setListingToDelete(null);
          }}
        >
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => {
                setShowDeleteDialog(false);
                setListingToDelete(null);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={confirmDelete}
            >
              Confirm Delete
            </button>
          </div>
        </DialogBox>
      )}
    </div>
  );
};

export default Listings;
