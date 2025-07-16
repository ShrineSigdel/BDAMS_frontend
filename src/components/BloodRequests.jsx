import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const { userProfile } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  // Only donors should access this page
  if (userProfile?.role !== 'donor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access denied. Only donors can view blood requests.</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const fetchRequests = async () => {
    try {
      const response = await ApiService.getBloodRequests();
      console.log('Blood requests response:', response);
      // Handle both response.data and direct response
      setRequests(response.data || response || []);
    } catch (error) {
      setError('Failed to fetch blood requests');
      console.error('Fetch requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId) => {
    try {
      await ApiService.respondToRequest(requestId, { message: responseMessage });
      setResponseMessage('');
      setSelectedRequest(null);
      // Refresh requests to show updated status
      await fetchRequests();
      alert('Response sent successfully!');
    } catch (error) {
      alert('Failed to send response. Please try again.');
      console.error('Response error:', error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading blood requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchRequests}
            className="mt-4 btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Blood Requests
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {userProfile?.role === 'donor' 
              ? 'Available blood requests you can respond to'
              : 'All blood requests in the system'
            }
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No blood requests</h3>
            <p className="mt-2 text-sm text-gray-500">
              There are currently no blood requests available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div key={request.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-semibold text-sm">
                            {request.bloodType}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.bloodType} Blood Needed
                        </h3>
                        <p className="text-sm text-gray-500">
                          Requested by: {request.requesterName}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {request.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(request.createdAt)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Status: {request.status}
                    </div>
                  </div>

                  {userProfile?.role === 'donor' && request.status === 'active' && (
                    <div className="mt-4">
                      {selectedRequest === request.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            placeholder="Enter your response message (optional)..."
                            className="w-full p-2 border border-gray-300 rounded-md resize-none"
                            rows="3"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRespond(request.id)}
                              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 text-sm"
                            >
                              Confirm Response
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(null);
                                setResponseMessage('');
                              }}
                              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedRequest(request.id)}
                          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 text-sm font-medium"
                        >
                          Respond to Request
                        </button>
                      )}
                    </div>
                  )}

                  {request.status === 'pending_confirmation' && (
                    <div className="mt-4 p-3 bg-yellow-100 rounded-md">
                      <p className="text-sm text-yellow-800 font-medium">
                        ⏳ Awaiting Recipient Confirmation
                      </p>
                    </div>
                  )}

                  {request.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-100 rounded-md">
                      <p className="text-sm text-green-800 font-medium">
                        ✓ Donation Completed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodRequests;
