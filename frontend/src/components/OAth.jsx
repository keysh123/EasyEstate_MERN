import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase'; // Adjust the import path as necessary
import { loginStart , loginFailure , loginSuccess } from "../services/userSlice";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OAth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const handleGoogleClick = async() => {
        try{
            dispatch(loginStart());
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app); // Ensure you have the auth instance from Firebase
            const result = await signInWithPopup(auth, provider);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: result.user.email,
                    name: result.user.displayName,
                    profilePicture: result.user.photoURL
                }),
            });
            const data = await response.json();
            if (data.success) {
                dispatch(loginSuccess(data.user));
                navigate("/");
                
                

                
                // Handle successful login, e.g., store user data in state or local storage
            } else {
                dispatch(loginFailure(data.message || "Login failed"));
                
                console.error("Login failed:", data.message);
            }

        }
        catch(err){
            console.error("Google OAuth error:", err);
        }
    }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 hover:opacity-45 transition text-white py-2 rounded-md font-medium '>
        Continue with Google
    </button>
  )
}

export default OAth