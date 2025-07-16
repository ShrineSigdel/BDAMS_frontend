import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    bloodType: '',
    location: '',
    urgency: 'medium'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await ApiService.createBloodRequest(formData);
      console.log('Request created:', result);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-requests'); // Navigate to my requests to see the created request
      }, 2000);
    } catch (error) {
      console.error('Create request error details:', error.response?.data || error);
      setError(error.response?.data?.message || 'Failed to create blood request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Only recipients can create requests
  if (userProfile?.role !== 'recipient') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Access denied. Only recipients can create blood requests.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Created Successfully!</h2>
          <p className="text-gray-600">Your blood request has been posted and donors will be notified.</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Blood Request
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Request blood donation from available donors
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                Blood Type Required
              </label>
              <div className="mt-1">
                <select
                  id="bloodType"
                  name="bloodType"
                  required
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1">
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., City Hospital, Downtown"
                  className="input-field"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter the hospital or location where blood is needed
              </p>
            </div>

            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                Urgency Level
              </label>
              <div className="mt-1">
                <select
                  id="urgency"
                  name="urgency"
                  required
                  value={formData.urgency}
                  onChange={handleChange}
                  className="input-field"
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Creating Request...' : 'Create Request'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
