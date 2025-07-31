import React, { useState } from 'react';
import SearchComponent from '../components/SearchComponent';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [listings, setListings] = useState([]);
const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen p-4 gap-4 bg-gray-50">
      {/* Sidebar Filter (Left) */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <SearchComponent setListings={setListings} />
        </div>
      </div>

      {/* Listings Grid (Right) */}
      <div className="w-full lg:w-2/3">
      <h1 className='text-3xl mb-4 font-semibold'>Listing Results : </h1>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.slice(0, 9).map((listing) => (
              <div
                key={listing._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-200"

                onClick={()=>{
                    navigate(`/listings/${listing._id}`)
                }}
              >
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="w-full h-36 object-cover rounded-t-xl"
                />
                <div className="p-3 space-y-1">
                  <h3 className="text-base font-bold text-gray-800 truncate capitalize">
                    {listing.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{listing.address}</p>
                  <p className="text-blue-600 font-semibold">
                    ₹{listing.price}
                    {listing.type === 'rent' && <span className="text-xs font-normal"> /month</span>}
                  </p>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{listing.bedrooms} 🛏</span>
                    <span>{listing.bathrooms} 🛁</span>
                    {listing.parking && <span>🅿️</span>}
                    {listing.furnished && <span>🪑</span>}
                  </div>
                  {listing.offer && (
                    <div className="text-xs inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      🔥 Offer Available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500">
            No listings found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
