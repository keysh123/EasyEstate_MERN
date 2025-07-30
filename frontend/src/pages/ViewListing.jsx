import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaCouch,
  FaShareAlt,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ViewListing = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchListingData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listings/${params.id}`
      );
      const data = await response.json();
      if (data.success) setListing(data.listing);
    } catch (err) {
      console.error('Failed to fetch listing:', err);
    }
  };

  useEffect(() => {
    fetchListingData();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 const arrowStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 50,
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
  };

  const NextArrow = ({ onClick }) => (
    <div style={{ ...arrowStyle, right: '10px' }} onClick={onClick}>
      <FaArrowRight className="text-blue-600 text-xl" />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div style={{ ...arrowStyle, left: '10px' }} onClick={onClick}>
      <FaArrowLeft className="text-blue-600 text-xl" />
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (!listing) return <p className="text-center mt-10">Loading listing...</p>;

  return (
    <div className="w-full mx-auto p-4">
      {/* Image Slider */}
      <div className="relative">
        <Slider {...sliderSettings} className="rounded-lg overflow-hidden">
          {listing.imageUrls.map((url, i) => (
            <div key={i}>
              <img
                src={url}
                alt={`slide-${i}`}
                className="w-full h-[400px] object-cover"
              />
            </div>
          ))}
        </Slider>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-3 right-3 bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-blue-50 z-30"
        >
          <FaShareAlt />
          {copied ? 'Link Copied!' : 'Share'}
        </button>
      </div>

      {/* Listing Info */}
      <div className="mt-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">{listing.name}</h1>
        <p className="text-gray-700 mt-2">{listing.description}</p>

        <div className="flex items-center gap-2 text-gray-600 mt-3">
          <FaMapMarkerAlt />
          <span>{listing.address}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-gray-800 text-sm">
          <div className="flex items-center gap-2">
            <FaBed />
            <span>{listing.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBath />
            <span>{listing.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-2">
            <FaParking />
            <span>{listing.parking ? 'Parking Available' : 'No Parking'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCouch />
            <span>{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
          </div>
          <div>
            <span className="font-medium">Type:</span> {listing.type}
          </div>
          <div>
            <span className="font-medium">Price:</span> ₹{listing.price}
          </div>
        </div>

        <button className='bg-slate-700 text-white p-2 w-1/3 mx-auto mt-3 rounded-md'>Contact Owner</button>
      </div>
    </div>
  );
};

export default ViewListing;
