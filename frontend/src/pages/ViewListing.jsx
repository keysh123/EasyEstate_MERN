import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import {
  FaMapMarkerAlt, FaBed, FaBath, FaParking, FaCouch, FaShareAlt,
  FaArrowLeft, FaArrowRight, FaUser, FaEnvelope, FaPhone
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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listings/${params.id}`);
      const data = await res.json();
      if (data.success) setListing(data.listing);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchListingData();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactClick = () => {
    if (!currentUser) {
      navigate('/sign-in');
      toast.info('Please sign in to contact the owner');
      return;
    }
    setShowContact(true);
    setMessage(`Hi, I'm interested in your ${listing.type} at ${listing.address}.`);
  };

  const handleSendMessage = () => {
    const subject = `Regarding your ${listing.type} at ${listing.address}`;
    const mailto = `mailto:${listing.userRef.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
  };

  const arrowStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    background: 'rgba(255,255,255,0.8)',
    borderRadius: '50%',
    padding: '10px',
    cursor: 'pointer',
  };

  const NextArrow = ({ onClick }) => (
    <div style={{ ...arrowStyle, right: '20px' }} onClick={onClick}>
      <FaArrowRight className="text-blue-600 text-lg" />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div style={{ ...arrowStyle, left: '20px' }} onClick={onClick}>
      <FaArrowLeft className="text-blue-600 text-lg" />
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

  if (!listing) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Slider */}
      <div className="relative rounded-xl overflow-hidden shadow-md">
        {listing.imageUrls.length >1 ?
        <Slider {...sliderSettings}>
          {listing.imageUrls.map((url, idx) => (
            <div key={idx}>
              <img
                src={url}
                alt={`slide-${idx}`}
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
            </div>
          ))}
        </Slider>
        : 
        <img
                src={listing.imageUrls[0]}
                // alt={`slide-${idx}`}
                className="w-full h-[300px] md:h-[500px] object-cover"
              />}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 bg-white px-3 py-2 rounded-full shadow text-sm flex items-center gap-2 text-blue-600 border border-blue-600 hover:bg-blue-50"
        >
          <FaShareAlt />
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Info Grid */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{listing.name}</h1>
          <div className="flex items-center text-gray-600 gap-2">
            <FaMapMarkerAlt className="text-blue-600" />
            <p className="truncate">{listing.address}</p>
          </div>
          <p className="text-gray-700 mt-3">{listing.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <FeatureCard icon={<FaBed />} label="Bedrooms" value={listing.bedrooms} />
            <FeatureCard icon={<FaBath />} label="Bathrooms" value={listing.bathrooms} />
            <FeatureCard icon={<FaParking />} label="Parking" value={listing.parking ? 'Yes' : 'No'} />
            <FeatureCard icon={<FaCouch />} label="Furnished" value={listing.furnished ? 'Yes' : 'No'} />
            <FeatureCard label="Type" value={listing.type} />
            <FeatureCard label="Price" value={`₹${listing.price.toLocaleString()}`} />
          </div>
        </div>

        {/* Contact Box */}
        <div className="bg-white rounded-lg shadow-md p-5 h-fit sticky top-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-100 p-2 rounded-full">
              <FaUser className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Owner</h4>
              <p className="text-sm text-gray-600">{listing.userRef.username}</p>
            </div>
          </div>

          {!showContact ? (
            <button
              onClick={handleContactClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow"
            >
              Contact Owner
            </button>
          ) : (
            <div className="space-y-3">
              <ContactInfo icon={<FaEnvelope />} text={listing.userRef.email} />
              {listing.userRef.phone && (
                <ContactInfo icon={<FaPhone />} text={listing.userRef.phone} />
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded p-2"
              />
              <button
                onClick={handleSendMessage}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded shadow"
              >
                Send Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, label, value }) => (
  <div className="bg-gray-50 p-4 rounded-md shadow-sm flex gap-3 items-center">
    {icon && <div className="text-blue-600 text-lg">{icon}</div>}
    <div>
      <p className="font-medium">{value}</p>
      {label && <p className="text-sm text-gray-600">{label}</p>}
    </div>
  </div>
);

const ContactInfo = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-gray-700">
    {icon}
    <span>{text}</span>
  </div>
);

export default ViewListing;
