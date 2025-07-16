import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register function - only calls backend
  const signup = async (email, password, name, role, bloodType) => {
    try {
      // Only call backend API - it will handle Firebase Auth creation
      const response = await ApiService.registerUser({
        email,
        password,
        name,
        role,
        bloodType
      });
      
      // After successful registration, sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null); // Clear profile on logout
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Get user profile from backend
  const getUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      const response = await ApiService.getProfile();
      console.log('Profile response:', response);
      
      // Handle both wrapped and unwrapped responses
      const profileData = response.data || response;
      setUserProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Get profile error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // User is signed in, fetch their profile
        try {
          await getUserProfile();
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Don't throw error here as it would break the app
        }
      } else {
        // User is signed out, clear profile
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    signin,
    logout,
    getUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
