import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaCouch,
  FaShareAlt,
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from 'react-redux';

const ViewListing = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState('');

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
    toast.success('Link copied to clipboard!');
  };

  const handleContactClick = () => {
    if (!currentUser) {
      navigate('/sign-in');
      toast.info('Please sign in to contact the owner');
      return;
    }
    setShowContact(!showContact);
   
    
    setMessage(`Hi, I'm interested in your ${listing.type} at ${listing.address}.`);
  };

  const handleSendMessage = () => {
    const subject = `Regarding your ${listing.type} at ${listing.address}`;
    const mailtoLink = `mailto:${listing.userRef.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  const arrowStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 50,
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '50%',
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  };

  const NextArrow = ({ onClick }) => (
    <div 
      style={{ ...arrowStyle, right: '20px' }} 
      onClick={onClick}
      className="hover:bg-white transition-all duration-200"
    >
      <FaArrowRight className="text-blue-600 text-xl" />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div 
      style={{ ...arrowStyle, left: '20px' }} 
      onClick={onClick}
      className="hover:bg-white transition-all duration-200"
    >
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

  if (!listing) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="w-full mx-auto p-4 md:p-6 max-w-7xl">
      {/* Image Slider */}
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <Slider {...sliderSettings}>
          {listing.imageUrls.map((url, i) => (
            <div key={i}>
              <img
                src={url}
                alt={`slide-${i}`}
                className="w-full h-[450px] md:h-[550px] object-cover"
              />
            </div>
          ))}
        </Slider>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 bg-white/90 text-blue-600 border border-blue-600 px-3 py-2 rounded-full flex items-center gap-1 text-sm hover:bg-blue-50 z-30 shadow-md transition-all duration-200"
        >
          <FaShareAlt />
          {copied ? 'Copied!' : ''}
        </button>
      </div>

      {/* Listing Info */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{listing.name}</h1>
          <div className="flex items-center gap-2 text-gray-600 mt-3">
            <FaMapMarkerAlt className="text-blue-500" />
            <span className="text-gray-700">{listing.address}</span>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 text-gray-800">
                <FaBed className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium">{listing.bedrooms}</p>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 text-gray-800">
                <FaBath className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium">{listing.bathrooms}</p>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 text-gray-800">
                <FaParking className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium">{listing.parking ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-gray-600">Parking</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 text-gray-800">
                <FaCouch className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium">{listing.furnished ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-gray-600">Furnished</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <p className="font-medium capitalize">{listing.type}</p>
                <p className="text-sm text-gray-600">Type</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <p className="font-medium">₹{listing.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Price</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUser className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Owner Information</h3>
              <p className="text-sm text-gray-600">Posted by {listing.userRef.username}</p>
            </div>
          </div>

          {!showContact ? (
            <button
              onClick={handleContactClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-md"
            >
              Contact Owner
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <FaEnvelope className="text-blue-500" />
                <span>{listing.userRef.email}</span>
              </div>
              {listing.userRef.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaPhone className="text-blue-500" />
                  <span>{listing.userRef.phone}</span>
                </div>
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="5"
                placeholder="Your message..."
              />
              <button
                onClick={handleSendMessage}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-md"
              >
                Send Message
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Price Details</h4>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Listing Price</span>
              <span className="font-semibold">₹{listing.price.toLocaleString()}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Contact the owner for negotiation and more details about the property.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewListing;