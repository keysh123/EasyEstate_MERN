// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "estate-mern-c9900",
  storageBucket: "estate-mern-c9900.firebasestorage.app",
  messagingSenderId: "365159143687",
  appId: "1:365159143687:web:117b84d4be3515561e4da2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);