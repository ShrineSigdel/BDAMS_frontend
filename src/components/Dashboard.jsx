import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [profileError, setProfileError] = useState(false);

  // Add a timeout for profile loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userProfile && currentUser) {
        console.log('Profile loading timeout - showing error');
        setProfileError(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [userProfile, currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile. Please try logging in again.</p>
          <button
            onClick={handleLogout}
            className="btn-primary"
          >
            Logout and Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
          <p className="mt-1 text-sm text-gray-500">This may take a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">BDAMS Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {userProfile.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{userProfile.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{userProfile.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-sm text-gray-900 capitalize">{userProfile.role}</p>
                </div>
                {userProfile.bloodType && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Blood Type</p>
                    <p className="text-sm text-gray-900">{userProfile.bloodType}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProfile.role === 'recipient' && (
              <>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      Request Blood
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Create a new blood donation request
                    </p>
                    <button
                      onClick={() => navigate('/create-request')}
                      className="btn-primary"
                    >
                      Create Request
                    </button>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      My Requests
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      View and manage your blood requests
                    </p>
                    <button
                      onClick={() => navigate('/my-requests')}
                      className="btn-secondary"
                    >
                      View My Requests
                    </button>
                  </div>
                </div>
              </>
            )}

            {userProfile.role === 'donor' && (
              <>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      View Blood Requests
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      See available blood donation requests you can respond to
                    </p>
                    <button
                      onClick={() => navigate('/blood-requests')}
                      className="btn-primary"
                    >
                      View Requests
                    </button>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      My Donations
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      View your donation history and responses
                    </p>
                    <button
                      onClick={() => navigate('/my-requests')}
                      className="btn-secondary"
                    >
                      View History
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
