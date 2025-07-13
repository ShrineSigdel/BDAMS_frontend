// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration from the screenshot
const firebaseConfig = {
  apiKey: "AIzaSyAV0-HtpEj_GJGz5u-GbTUSVFBmV7wx1d4s", // Example from screenshot
  authDomain: "bdams-f241f.firebaseapp.com",
  projectId: "bdams-f241f",
  storageBucket: "bdams-f241f.firebasestorage.app",
  messagingSenderId: "745158169384",
  appId: "1:745158169384:web:04af9310c2afe206bc361d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth service so you can use it in your components
export const auth = getAuth(app);