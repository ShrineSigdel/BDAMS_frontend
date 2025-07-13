// API Service for BDAMS Backend Integration

import axios from 'axios';
import { auth } from '../firebase';

// --- IMPORTANT CONFIGURATION ---
// Change this to true when you deploy your backend and want to use the live version
const isProduction = false; 

// Your LIVE backend URL after you deploy it.
const productionURL = 'https://us-central1-bdams-f241f.cloudfunctions.net/api'; 

// Your LOCAL backend URL - Updated to match your test configuration
const developmentURL = 'http://localhost:8080/api'; 

const baseURL = isProduction ? productionURL : developmentURL;

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Interceptor: This automatically adds the user's ID token to every API request.
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger logout here
      console.error('Authentication error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// API Service class with all endpoints
class ApiService {
  // User endpoints
  async registerUser(userData) {
    const response = await apiClient.post('/register', userData);
    return response.data;
  }

  async getProfile() {
    const response = await apiClient.get('/profile');
    return response.data;
  }

  async updateProfile(userData) {
    const response = await apiClient.put('/profile', userData);
    return response.data;
  }

  // Blood request endpoints
  async postBloodRequest(requestData) {
    const response = await apiClient.post('/requests', requestData);
    return response.data;
  }

  async getBloodRequests() {
    const response = await apiClient.get('/requests');
    return response.data;
  }

  async respondToBloodRequest(requestId, responseData) {
    const response = await apiClient.post(`/requests/${requestId}/respond`, responseData);
    return response.data;
  }

  async completeDonation(requestId, donationData) {
    const response = await apiClient.post(`/requests/${requestId}/complete`, donationData);
    return response.data;
  }

  async getRequestById(requestId) {
    const response = await apiClient.get(`/requests/${requestId}`);
    return response.data;
  }

  async updateRequest(requestId, updateData) {
    const response = await apiClient.put(`/requests/${requestId}`, updateData);
    return response.data;
  }

  async deleteRequest(requestId) {
    const response = await apiClient.delete(`/requests/${requestId}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiClient;