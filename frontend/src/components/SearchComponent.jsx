import React, { useState, useEffect } from "react";


const SearchComponent = ({ setListings }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState([]);
  const [offer, setOffer] = useState(false);
  const [amenities, setAmenities] = useState({
    parking: false,
    furnished: false,
  });
  const [sortBy, setSortBy] = useState("latest");

  // 🧠 Handle initial load from URL only once
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermParam = urlParams.get("searchTerm") || "";
    const typeParam = urlParams.get("type");
    const types = typeParam === "all" ? ["sale", "rent"] : typeParam ? [typeParam] : [];

    const offerParam = urlParams.get("offer") === "true";
    const parkingParam = urlParams.get("parking") === "true";
    const furnishedParam = urlParams.get("furnished") === "true";
    const sortParam = urlParams.get("sortBy") || "latest";

    // Set state
    setSearchTerm(searchTermParam);
    setType(types);
    setOffer(offerParam);
    setAmenities({
      parking: parkingParam,
      furnished: furnishedParam,
    });
    setSortBy(sortParam);

    // 🔥 Trigger search with URL values
    fetchListingsFromParams({
      searchTerm: searchTermParam,
      type: types,
      offer: offerParam,
      amenities: {
        parking: parkingParam,
        furnished: furnishedParam,
      },
      sortBy: sortParam,
    });
  }, [location.search]);

  const fetchListingsFromParams = async (params) => {
    const query = new URLSearchParams();

    if (params.searchTerm) query.set("searchTerm", params.searchTerm);
    if (params.type?.length === 2) query.set("type", "all");
    else if (params.type?.length === 1) query.set("type", params.type[0]);

    if (params.offer) query.set("offer", true);
    if (params.amenities.parking) query.set("parking", true);
    if (params.amenities.furnished) query.set("furnished", true);
    if (params.sortBy) query.set("sortBy", params.sortBy);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listings/get?${query.toString()}`
      );

      if (!response.ok) throw new Error("Failed to fetch listings");

      const data = await response.json();
      setListings(data.listings);
    } catch (err) {
      console.error("Search failed:", err.message);
    }
  };

  const handleSearch = () => {
    const query = new URLSearchParams();

    if (searchTerm) query.set("searchTerm", searchTerm);
    if (type.length === 2) query.set("type", "all");
    else if (type.length === 1) query.set("type", type[0]);

    if (offer) query.set("offer", true);
    if (amenities.parking) query.set("parking", true);
    if (amenities.furnished) query.set("furnished", true);
    if (sortBy) query.set("sortBy", sortBy);

    // Update URL
    window.history.pushState({}, "", `?${query.toString()}`);

    // Trigger search
    fetchListingsFromParams({
      searchTerm,
      type,
      offer,
      amenities,
      sortBy,
    });
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setType((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((t) => t !== value)
    );
  };

  const handleAmenitiesChange = (e) => {
    const { name, checked } = e.target;
    setAmenities((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="p-6 rounded shadow space-y-4 h-screen">
      <h2 className="text-xl font-semibold mb-2">Search Listings</h2>

      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Search by keyword..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex gap-3">
        <label className="font-medium">Type:</label>
        <div className="flex gap-4 mt-1">
          {["sale", "rent"].map((item) => (
            <label key={item} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={item}
                checked={type.includes(item)}
                onChange={handleTypeChange}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="offer"
          checked={offer}
          onChange={(e) => setOffer(e.target.checked)}
        />
        <label htmlFor="offer">Offer</label>
      </div>

      <div className="flex gap-3">
        <label className="font-medium">Amenities:</label>
        <div className="flex gap-4 mt-1">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              name="parking"
              checked={amenities.parking}
              onChange={handleAmenitiesChange}
            />
            Parking
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              name="furnished"
              checked={amenities.furnished}
              onChange={handleAmenitiesChange}
            />
            Furnished
          </label>
        </div>
      </div>

      <div>
        <label className="font-medium">Sort By:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded mt-1"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-slate-500 text-white p-2 rounded hover:bg-slate-900"
      >
        Search
      </button>
    </div>
  );
};

export default SearchComponent;
