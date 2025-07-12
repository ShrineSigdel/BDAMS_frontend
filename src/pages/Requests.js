import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { requestAPI } from '../utils/api';

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const isDonor = user?.role === 'donor';
  const isRecipient = user?.role === 'recipient';

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter) {
        params.bloodType = filter;
      }
      
      const response = await requestAPI.getRequests(params);
      setRequests(response.data);
    } catch (error) {
      setError('Failed to fetch requests');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId) => {
    try {
      await requestAPI.respondToRequest(requestId);
      fetchRequests(); // Refresh the list
    } catch (error) {
      setError('Failed to respond to request');
      console.error('Error responding to request:', error);
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await requestAPI.completeRequest(requestId);
      fetchRequests(); // Refresh the list
    } catch (error) {
      setError('Failed to complete request');
      console.error('Error completing request:', error);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending_confirmation':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isDonor ? 'Blood Requests' : 'My Requests'}
          </h1>
          
          {isDonor && (
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Blood Types</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg">Loading requests...</div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-500">
              <p className="text-lg mb-2">No requests found</p>
              <p className="text-sm">
                {isDonor && 'There are no active blood requests at the moment.'}
                {isRecipient && 'You haven\'t created any requests yet.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">
                          {request.bloodType}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Blood Type: {request.bloodType}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Location: {request.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency} urgency
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <p>Created: {new Date(request.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                      {request.donorId && (
                        <p>Donor assigned: Yes</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {isDonor && request.status === 'active' && !request.donorId && (
                      <button
                        onClick={() => handleRespond(request.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Respond
                      </button>
                    )}
                    
                    {isDonor && request.status === 'pending_confirmation' && request.donorId && (
                      <button
                        onClick={() => handleComplete(request.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Complete
                      </button>
                    )}
                    
                    {isRecipient && request.status === 'active' && (
                      <span className="text-sm text-blue-600 font-medium">
                        Waiting for donor
                      </span>
                    )}
                    
                    {isRecipient && request.status === 'pending_confirmation' && (
                      <span className="text-sm text-yellow-600 font-medium">
                        Donor found
                      </span>
                    )}
                    
                    {request.status === 'completed' && (
                      <span className="text-sm text-green-600 font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
