// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: "mern-estate-9ea16.firebaseapp.com",
  projectId: "mern-estate-9ea16",
  storageBucket: "mern-estate-9ea16.appspot.com",
  messagingSenderId: "854015324994",
  appId: "1:854015324994:web:b0685b1033b1d159db4edb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);