import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateUserStart , updateUserFailure , updateUserSuccess } from '../services/userSlice';

const Profile = () => {
  const dispatch = useDispatch();

  
  const fileInputRef = useRef(null);
  const { currentUser , loading } = useSelector((state) => state.user);

  const [profileData, setProfileData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    profilePicture: currentUser.profilePicture || '',
  });

  const [originalData, setOriginalData] = useState(profileData); // Store original values
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'MERN_Real-EState');

    try {
      setIsUploading(true);
      const response = await fetch('https://api.cloudinary.com/v1_1/dzlpfgc43/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setIsUploading(false);

      if (data.secure_url) {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: data.secure_url,
        }));
        toast.success('File uploaded successfully');
      } else {
        toast.error('File upload failed');
        console.error('File upload failed:', data);
      }
    } catch (error) {
      setIsUploading(false);
      toast.error('File upload failed');
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const isChanged =
    profileData.username !== originalData.username ||
    profileData.email !== originalData.email ||
    profileData.profilePicture !== originalData.profilePicture;
  
  const handleUpdate = async () => {
    if (!isChanged) {
      toast.info('No changes made to update');
      return;
    }
    try {
      dispatch(updateUserStart());
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      console.log(data);
      
      if (data.success) {
        setOriginalData(profileData); // Update original data after successful update
        dispatch(updateUserSuccess(data.user));
      } else {
        dispatch(updateUserFailure(data.message || 'Failed to update profile'));
        
      }
    } catch (error) {
      dispatch(updateUserFailure('Failed to update profile'));
      console.error('Error updating profile:', error);
      
    }
  }

  return (
    <div className="bg-slate-100 w-[95%] sm:w-[90%] md:w-[70%] lg:w-1/3 mx-auto my-10 p-5 rounded-lg shadow-md">
      <h1 className="text-3xl text-center font-semibold mb-3">Profile</h1>
      <form  className="flex flex-col gap-5 items-center justify-center">
        <input
          accept="image/*"
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
              const reader = new FileReader();
              reader.onloadend = () => {
                setProfileData((prev) => ({
                  ...prev,
                  profilePicture: reader.result, // temporary preview
                }));
              };
              reader.readAsDataURL(selectedFile);
            }
          }}
        />
        <img
          onClick={() => fileInputRef.current.click()}
          className="w-24 h-24 rounded-full object-cover cursor-pointer border-2 border-slate-300 hover:scale-105 transition"
          src={profileData.profilePicture}
          alt="Profile"
        />

        <input
          className="bg-white p-2 rounded-md w-full"
          type="text"
          name="username"
          value={profileData.username}
          onChange={handleInputChange}
          placeholder="Username"
        />

        <input
          className="bg-white p-2 rounded-md w-full"
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />

        <button
          type="button"
          className={`w-full p-2 rounded-md text-white ${
            isChanged ? 'bg-slate-700 hover:bg-slate-500' : 'bg-slate-300 cursor-not-allowed'
          }`}
          disabled={!isChanged || isUploading || loading}
          onClick={handleUpdate}
        >
          {(loading || isUploading) ? 'Uploading...' : 'Update Profile'}
        </button>

        <button className="bg-green-700 text-white w-full p-2 rounded-md hover:bg-green-500">
          Create Listing
        </button>

        <div className="flex gap-4 items-center justify-between w-full text-red-500">
          <button type="button">Delete Account</button>
          <button type="button">Logout</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
