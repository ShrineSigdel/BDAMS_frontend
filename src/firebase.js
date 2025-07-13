// Firebase Client Setup
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "demo-key", // For emulator
  authDomain: "bdams-f241f.firebaseapp.com",
  projectId: "bdams-f241f",
  storageBucket: "bdams-f241f.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  // Only connect if not already connected
  if (!auth._authSettings?.emulator) {
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
  if (!db._settings?.host?.includes('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
}

export default app;
