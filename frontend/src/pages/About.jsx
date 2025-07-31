import React from 'react';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-slate-800">About EasyEstate</h1>
      
      <p className="text-lg text-slate-700 leading-7 mb-6">
        Welcome to <strong>EasyEstate</strong>, your go-to platform for seamless real estate experiences.
        Whether you're looking to buy, sell, or rent properties, EasyEstate is here to simplify the process
        for you with powerful tools and user-friendly features.
      </p>

      <div className="grid sm:grid-cols-2 gap-8 mt-10">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">What We Offer</h2>
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            <li>Browse listings for sale and rent</li>
            <li>Filter properties based on your needs</li>
            <li>Detailed descriptions and high-quality images</li>
            <li>Post your own property with ease</li>
            <li>Real-time updates and search results</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            <li>User-friendly interface</li>
            <li>Advanced search filters</li>
            <li>Secure and reliable listings</li>
            <li>Dedicated support for queries</li>
            <li>Trusted by thousands of users</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-slate-600">
        <p>
          EasyEstate is committed to transforming the way people buy, sell, and rent properties.
          We believe in making real estate accessible and efficient for everyone.
        </p>
      </div>
    </div>
  );
};

export default About;
