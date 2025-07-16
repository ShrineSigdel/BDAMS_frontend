import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLinkClass = (path) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-primary-700 text-white'
        : 'text-gray-300 hover:bg-primary-600 hover:text-white'
    }`;
  };

  if (!currentUser) {
    return null; // Don't show navbar on login/register pages
  }

  return (
    <nav className="bg-primary-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-white text-xl font-bold">BDAMS</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className={getLinkClass('/dashboard')}>
              Dashboard
            </Link>
            
            {userProfile?.role === 'donor' && (
              <Link to="/blood-requests" className={getLinkClass('/blood-requests')}>
                Blood Requests
              </Link>
            )}

            {userProfile?.role === 'recipient' && (
              <>
                <Link to="/create-request" className={getLinkClass('/create-request')}>
                  Create Request
                </Link>
                <Link to="/my-requests" className={getLinkClass('/my-requests')}>
                  My Requests
                </Link>
              </>
            )}

            {userProfile?.role === 'donor' && (
              <Link to="/my-requests" className={getLinkClass('/my-requests')}>
                My Donations
              </Link>
            )}

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-gray-300">
                  <div className="text-sm font-medium">{userProfile?.name}</div>
                  <div className="text-xs text-gray-400 capitalize">{userProfile?.role}</div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
