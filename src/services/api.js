import axios from 'axios';
import { auth } from '../config/firebase';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// API Service class
class ApiService {
  // User endpoints
  async registerUser(userData) {
    const response = await api.post('/register', userData);
    return response.data;
  }

  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  }

  async updateProfile(userData) {
    const response = await api.put('/profile', userData);
    return response.data;
  }

  // Blood request endpoints
  async createBloodRequest(requestData) {
    const response = await api.post('/requests', requestData);
    return response.data;
  }

  // Get all active blood requests (for donors to view and respond)
  async getBloodRequests(bloodType = null) {
    try {
      const params = bloodType ? { bloodType } : {};
      console.log('Calling GET /requests with params:', params);
      const response = await api.get('/requests', { params });
      console.log('API response for blood requests:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }

  // Get user-specific requests (recipients: their requests, donors: requests they responded to)
  async getMyRequests() {
    try {
      console.log('Calling GET /requests/my-requests for user-specific requests');
      const response = await api.get('/requests/my-requests');
      console.log('API response for my requests:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching my requests:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }

  // Donor responds to a blood request
  async respondToRequest(requestId, responseData) {
    const response = await api.post(`/requests/${requestId}/respond`, responseData);
    return response.data;
  }

  // Cancel a blood request (recipients only)
  async cancelRequest(requestId) {
    try {
      const response = await api.delete(`/requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling request:', error);
      throw error;
    }
  }

  // Complete a donation (recipients only)
  async completeDonation(requestId) {
    const response = await api.post(`/requests/${requestId}/complete`);
    return response.data;
  }
}

export default new ApiService();
