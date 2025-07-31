import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const navigate = useNavigate();

  const demoImageURLS = [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D',
    'https://plus.unsplash.com/premium_photo-1661962841993-99a07c27c9f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHx8MHx8fDA%3D'
  ]
  const arrowStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    zIndex: 10, background: 'rgba(255,255,255,0.8)',
    borderRadius: '50%', padding: '10px', cursor: 'pointer',
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
    dots: true, infinite: true, speed: 500,
    autoplay: true, autoplaySpeed: 3000,
    slidesToShow: 1, slidesToScroll: 1,
    nextArrow: <NextArrow />, prevArrow: <PrevArrow />,
  };

  const fetchListings = async (params, setter) => {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listings/get?${query}`);
      const data = await res.json();
      setter(data.listings || []);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    }
  };

  useEffect(() => {
    fetchListings({ offer: true, limit: 3 }, setOfferListings);
    fetchListings({ type: 'sale', limit: 3 }, setSaleListings);
    fetchListings({ type: 'rent', limit: 3 }, setRentListings);
  }, []);

  const handleShowMore = (query) => {
    navigate(`/search?${query}`);
  };

  const ListingGrid = ({ listings }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-4">
      {listings.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition"
        >
          <img
            src={item.imageUrls?.[0] || '/no-image.jpg'}
            alt={item.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-3">
            <h3 className="font-semibold text-lg truncate">{item.name}</h3>
            <p className="text-slate-600 text-sm truncate">{item.address}</p>
            <p className="text-blue-600 font-bold mt-2">
              ₹{item.price} {item.type === 'rent' && <span>/ month</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pb-10">
      {/* Hero Section */}
      <div className="m-10 w-[85%] lg:m-40 lg:w-[40%] space-y-5">
        <h1 className="text-5xl text-slate-600 font-bold">
          Find your next <span className="text-slate-400">perfect</span> place with ease
        </h1>
        <p className="mt-2 text-slate-500">
          EasyEstate will help you find your home fast, easy, and comfortable.
          <br />
          Our expert support is always available.
        </p>
        <p className="mt-2 text-blue-700 font-semibold">Let's Start now ... !</p>
      </div>

      {/* Image Carousel */}
      <div className="relative rounded-xl overflow-hidden shadow-md">
        <Slider {...sliderSettings}>
          {demoImageURLS.map((url, idx) => (
            <div key={idx}>
              <img
                src={url}
                alt={`slide-${idx}`}
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* 3 Listing Sections */}
      <div className="px-6 mt-14 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">🔥 Recent Offers</h2>
          <ListingGrid listings={offerListings} />
          <div className="text-right mt-2">
            <button
              onClick={() => handleShowMore('offer=true')}
              className="text-blue-600 hover:underline"
            >
              Show more offers →
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">🏷️ Properties for Sale</h2>
          <ListingGrid listings={saleListings} />
          <div className="text-right mt-2">
            <button
              onClick={() => handleShowMore('type=sale')}
              className="text-blue-600 hover:underline"
            >
              Show more for sale →
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">🏠 Properties for Rent</h2>
          <ListingGrid listings={rentListings} />
          <div className="text-right mt-2">
            <button
              onClick={() => handleShowMore('type=rent')}
              className="text-blue-600 hover:underline"
            >
              Show more for rent →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
