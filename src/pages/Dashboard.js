import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const isDonor = user?.role === 'donor';
  const isRecipient = user?.role === 'recipient';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isDonor && 'Thank you for being a blood donor. Your donations save lives!'}
            {isRecipient && 'Manage your blood requests and find donors here.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              {isDonor && user?.bloodType && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Blood Type:</span>
                  <span className="text-sm font-medium text-red-600">{user.bloodType}</span>
                </div>
              )}
            </div>
            <Link
              to="/profile"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-center block"
            >
              View Profile
            </Link>
          </div>

          {/* Blood Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">R</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Blood Requests</h3>
                <p className="text-sm text-gray-600">
                  {isDonor && 'Find people who need blood'}
                  {isRecipient && 'Manage your requests'}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                to="/requests"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
              >
                {isDonor ? 'View Requests' : 'My Requests'}
              </Link>
              {isRecipient && (
                <Link
                  to="/create-request"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center block"
                >
                  Create New Request
                </Link>
              )}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">S</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                <p className="text-sm text-gray-600">Your impact</p>
              </div>
            </div>
            <div className="space-y-2">
              {isDonor && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Donations:</span>
                    <span className="text-sm font-medium">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lives Saved:</span>
                    <span className="text-sm font-medium text-green-600">--</span>
                  </div>
                </>
              )}
              {isRecipient && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Requests:</span>
                    <span className="text-sm font-medium">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed:</span>
                    <span className="text-sm font-medium text-green-600">--</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Member Since:</span>
                <span className="text-sm font-medium">
                  {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">
                {isDonor && 'Start by viewing blood requests in your area'}
                {isRecipient && 'Create your first blood request to get started'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
