// Firebase configuration for BDAMS
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv0HtpEj_GjGz5u-Gb1USVFBmV7wxld4s",
  authDomain: "bdams-f241f.firebaseapp.com",
  projectId: "bdams-f241f",
  storageBucket: "bdams-f241f.firebasestorage.app",
  messagingSenderId: "745158169384",
  appId: "1:745158169384:web:04af9310c2afe206bc361d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.MODE === 'development') {
  // Connect to Firebase Auth emulator
  connectAuthEmulator(auth, "http://localhost:9099");
  
  // Connect to Firestore emulator
  connectFirestoreEmulator(db, "localhost", 8080);
}

export default app;
