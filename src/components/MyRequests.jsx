import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { userProfile } = useAuth();

  const fetchMyRequests = useCallback(async () => {
    try {
      console.log('Fetching requests for user role:', userProfile?.role);
      // Both donors and recipients use the same /requests endpoint
      // Backend should filter based on the authenticated user
      const response = await ApiService.getMyRequests();
      
      console.log('My requests response:', response);
      // Handle both response.data and direct response
      const requestsData = response.data || response || [];
      console.log('Processed requests data:', requestsData);
      setRequests(requestsData);
    } catch (error) {
      setError('Failed to fetch your requests');
      console.error('Fetch my requests error:', error);
    } finally {
      setLoading(false);
    }
  }, [userProfile?.role]);

  useEffect(() => {
    if (userProfile?.role) {
      fetchMyRequests();
    }
  }, [userProfile?.role, fetchMyRequests]);

  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await ApiService.cancelRequest(requestId);
        // Refresh the requests to show updated status
        await fetchMyRequests();
        alert('Request cancelled successfully');
      } catch (error) {
        alert('Failed to cancel request');
        console.error('Cancel request error:', error);
      }
    }
  };

  const handleMarkAsFulfilled = async (requestId) => {
    if (window.confirm('Are you sure you want to mark this request as fulfilled?')) {
      try {
        await ApiService.completeDonation(requestId);
        // Refresh the requests to show updated status
        await fetchMyRequests();
        alert('Request marked as fulfilled successfully');
      } catch (error) {
        alert('Failed to mark request as fulfilled');
        console.error('Mark as fulfilled error:', error);
      }
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
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
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
          <p className="mt-2 text-gray-600">Loading your requests...</p>
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
            onClick={fetchMyRequests}
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
            {userProfile?.role === 'donor' ? 'My Donations' : 'My Blood Requests'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {userProfile?.role === 'donor' 
              ? 'View your donation responses and history'
              : 'Manage your blood donation requests'
            }
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              {userProfile?.role === 'donor' ? 'No donations yet' : 'No requests yet'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {userProfile?.role === 'donor' 
                ? "You haven't responded to any blood requests yet."
                : "You haven't created any blood requests yet."
              }
            </p>
            {userProfile?.role === 'recipient' && (
              <div className="mt-6">
                <button
                  onClick={() => window.location.href = '/create-request'}
                  className="btn-primary"
                >
                  Create Request
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-semibold">
                            {request.bloodType}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.bloodType} Blood Request
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created on {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Location: {request.location}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2V4a2 2 0 012-2h4a2 2 0 012 2v4z" />
                        </svg>
                        Responses: {request.responses ? request.responses.length : 0}
                      </div>
                    </div>
                  </div>

                  {/* Show responses if available */}
                  {request.responses && request.responses.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                        className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {selectedRequest === request.id ? 'Hide' : 'View'} Responses ({request.responses.length})
                      </button>
                      
                      {selectedRequest === request.id && (
                        <div className="mt-3 space-y-3">
                          {request.responses.map((response, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {response.donorName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(response.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{response.message}</p>
                              <div className="mt-2 text-xs text-gray-500">
                                Contact: {response.donorContact}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 flex justify-end space-x-2">
                    {/* Recipients can cancel their own active requests */}
                    {userProfile?.role === 'recipient' && request.status === 'active' && (
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Request
                      </button>
                    )}
                    
                    {/* Recipients can mark pending requests as complete */}
                    {userProfile?.role === 'recipient' && request.status === 'pending_confirmation' && (
                      <button
                        onClick={() => handleMarkAsFulfilled(request.id)}
                        className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mark as Fulfilled
                      </button>
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

export default MyRequests;
