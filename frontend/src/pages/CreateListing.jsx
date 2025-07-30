import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector , useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { createListing , editListing } from "../services/myListingSlice";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const editData = location.state?.listing || null; // Passed from edit page
  const isEditMode = Boolean(editData);

  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    price: "",
    bathrooms: "",
    bedrooms: "",
    furnished: false,
    parking: false,
    type: "",
    offer: false,
    imageUrls: [],
  });
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData(editData);
    }
  }, [editData]);
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      price: "",
      bathrooms: "",
      bedrooms: "",
      furnished: false,
      parking: false,
      type: "",
      offer: false,
      imageUrls: [],
    });
    setFiles([]);
  };

  const handleChange = (e) => {
    const { type, name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async () => {
    if (files.length > 6) {
      toast.error("You can upload a maximum of 6 images");
      return;
    }

    setIsUploading(true);
    const uploadedUrls = [];

    for (let file of files) {
      const formDataImg = new FormData();
      formDataImg.append("file", file);
      formDataImg.append("upload_preset", "MERN_Real-EState");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dzlpfgc43/image/upload",
          {
            method: "POST",
            body: formDataImg,
          }
        );
        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          toast.error("Image upload failed");
        }
      } catch (error) {
        toast.error("Error uploading image");
        console.error(error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...uploadedUrls],
    }));

    setIsUploading(false);
  };

  const removeImage = (index) => {
    const updatedUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      imageUrls: updatedUrls,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.type) {
    toast.error("Select at least one type");
    return;
  }
  const data = {
    ...formData,
    'userRef' : currentUser._id
  }

  try {
    if (isEditMode) {
      await dispatch(
        editListing({ listingId: editData._id, updatedData: formData })
      );
      navigate('/')
    } else {
      await dispatch(createListing(data));
    }

    // Optional: reset or navigate after success
    resetForm();
    // navigate("/my-listings");
  } catch (error) {
    console.log(error);
    
    toast.error('Problem...try again')
    // Error toast already shown inside the thunk
  }
};


  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
        Create a Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-8 bg-white shadow-md rounded-xl p-6"
      >
        {/* Left section */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
            value={formData.name}
            className="p-3 border rounded-md"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            required
            onChange={handleChange}
            value={formData.description}
            className="p-3 border rounded-md"
          />
          <textarea
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
            value={formData.address}
            className="p-3 border rounded-md resize-none"
          ></textarea>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="rent"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              Rent
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="sale"
                checked={formData.type === "sale"}
                onChange={handleChange}
              />
              Sale
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="parking"
                checked={formData.parking}
                onChange={handleChange}
              />
              Parking
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="furnished"
                checked={formData.furnished}
                onChange={handleChange}
              />
              Furnished
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="offer"
                checked={formData.offer}
                onChange={handleChange}
              />
              Offer
            </label>
          </div>

          <div className="flex flex-wrap gap-6 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                className="w-16 p-2 border rounded"
              />
              Bedrooms
            </label>
            <label className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                className="w-16 p-2 border rounded"
              />
              Bathrooms
            </label>
          </div>

          <label className="flex items-center gap-3 mt-4">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-28 p-2 border rounded"
            />
            <span>
              Regular Price <small className="text-gray-500">($/month)</small>
            </span>
          </label>
        </div>

        {/* Right section */}
        <div className="flex flex-col gap-4 flex-1">
          <p>
            <span className="font-semibold">Images:</span> First image will be
            cover (max 6)
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            className="border p-2 rounded-md"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={isUploading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Images"}
          </button>

          {/* Image preview + delete */}
          {formData.imageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md mt-4 disabled:opacity-50"
          >
            {isUploading ? "Please wait..." : isEditMode ? "Edit Listing" : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
