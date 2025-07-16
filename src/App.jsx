import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateRequest from './components/CreateRequest';
import BloodRequests from './components/BloodRequests';
import MyRequests from './components/MyRequests';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create-request" element={
              <ProtectedRoute>
                <CreateRequest />
              </ProtectedRoute>
            } />
            <Route path="/blood-requests" element={
              <ProtectedRoute>
                <BloodRequests />
              </ProtectedRoute>
            } />
            <Route path="/my-requests" element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
