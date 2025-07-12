# 🩸 BDAMS Frontend - Blood Donation & Management System

A modern, responsive React frontend for managing blood donations and connecting donors with recipients in need.

## 🌟 System Overview

BDAMS is a comprehensive blood bank management system designed to bridge the gap between blood donors and recipients. The system facilitates:

- **Donor Registration & Management**: Allows people to register as blood donors
- **Blood Request Creation**: Recipients can create urgent blood requests
- **Real-time Matching**: Connects donors with compatible blood requests
- **Request Management**: Complete workflow from request creation to completion
- **Profile Management**: Users can manage their personal information and donation history

## 🚀 Quick Setup

### Prerequisites

- Node.js 14+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:8080`

### Installation

1. **Clone and navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
npm start
```

4. **Open application:**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8080` (must be running)

## 🏗️ System Architecture & Flow

### User Journey Flow

#### 1. **Registration Flow**

```
User visits homepage → Clicks Register → Selects Role (Donor/Recipient) →
Fills form → Submits → Account created → Redirected to Login
```

#### 2. **Donor Flow**

```
Login → Dashboard → View Blood Requests → Filter by blood type →
Respond to Request → Request status changes to "Pending" →
Complete Donation → Request marked as "Completed"
```

#### 3. **Recipient Flow**

```
Login → Dashboard → Create Blood Request → Fill details (blood type, location, urgency) →
Submit Request → Wait for donor response → Request fulfilled →
Receive notification → Mark as completed
```

### Technical Flow

#### Authentication Flow

1. **Login Process**: User credentials → API call → JWT token stored → User context updated
2. **Route Protection**: Private routes check authentication → Redirect to login if unauthorized
3. **Token Management**: Auto-refresh tokens → Logout on expiration

#### Data Flow

1. **API Layer**: Axios interceptors handle auth headers and error responses
2. **State Management**: React Context API manages global authentication state
3. **Component Communication**: Props and context for data sharing

## 📱 User Interface Design

### Color Scheme

- **Primary Red**: Medical/emergency theme (`#dc2626`)
- **Secondary Gray**: Professional, clean look
- **Status Colors**: Green (success), Yellow (pending), Red (urgent)

### Component Design Philosophy

- **Minimalistic**: Clean, clutter-free interfaces
- **Medical Theme**: Red color scheme reflecting blood donation
- **Professional**: Business-appropriate design
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessibility**: Clear typography and color contrast

## 🛠️ Tech Stack

### Frontend Technologies

- **React 18**: Modern React with hooks and functional components
- **React Router v6**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API communications
- **Context API**: State management for authentication

### Development Tools

- **React Scripts**: Build and development tools
- **PostCSS**: CSS processing and Tailwind compilation
- **ESLint**: Code linting and formatting

## 📂 Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.js      # Navigation bar with auth state
│   │   └── PrivateRoute.js # Route protection wrapper
│   ├── contexts/          # React contexts
│   │   └── AuthContext.js # Authentication state management
│   ├── pages/             # Page components
│   │   ├── Home.js        # Landing page with hero section
│   │   ├── Login.js       # User authentication
│   │   ├── Register.js    # User registration with role selection
│   │   ├── Dashboard.js   # User dashboard with quick actions
│   │   ├── Profile.js     # Profile management and editing
│   │   ├── Requests.js    # Blood requests listing and management
│   │   └── CreateRequest.js # New blood request creation
│   ├── utils/             # Utility functions
│   │   └── api.js         # API configuration and interceptors
│   ├── App.js             # Main app component with routing
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles and Tailwind directives
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## 🔐 Authentication System

### User Roles

- **Donor**: Can view and respond to blood requests
- **Recipient**: Can create and manage blood requests

### Authentication Features

- **JWT Token**: Secure token-based authentication
- **Auto-redirect**: Unauthorized users redirected to login
- **Session Management**: Automatic logout on token expiration
- **Role-based Access**: Different features for different user types

## 🩸 Blood Request Management

### Request Lifecycle

1. **Creation**: Recipient creates request with blood type, location, urgency
2. **Active**: Request visible to all donors
3. **Pending**: Donor responds, request assigned
4. **Completed**: Donation completed, request closed

### Features

- **Blood Type Filtering**: Donors can filter requests by blood type
- **Urgency Levels**: High/Medium/Low priority system
- **Location-based**: Requests include location information
- **Status Tracking**: Real-time status updates

## 🎨 UI/UX Features

### Design Principles

- **Medical Theme**: Red color scheme for blood donation context
- **Clean Layout**: Minimalistic, professional appearance
- **Responsive**: Mobile-first design approach
- **User-friendly**: Intuitive navigation and clear CTAs

### Key UI Components

- **Hero Section**: Engaging landing page
- **Dashboard Cards**: Quick access to main features
- **Request Cards**: Clean blood request display
- **Form Design**: Well-structured, validated forms
- **Navigation**: Responsive navbar with user state

## 🔧 API Integration

### Backend Communication

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: Bearer token in headers
- **Error Handling**: Automatic retry and user feedback
- **Request Interceptors**: Auto-attach auth tokens

### Key Endpoints

```
POST /api/register       # User registration
POST /api/login          # User authentication
GET  /api/profile        # Get user profile
PUT  /api/profile        # Update user profile
POST /api/requests       # Create blood request
GET  /api/requests       # Get blood requests (with filters)
POST /api/requests/:id/respond  # Respond to request
POST /api/requests/:id/complete # Complete donation
```

## 📊 System Features

### For Donors

- **View Requests**: Browse all active blood requests
- **Filter Options**: Filter by blood type, location, urgency
- **Quick Response**: One-click response to requests
- **Donation History**: Track past donations
- **Profile Management**: Update personal information

### For Recipients

- **Create Requests**: Submit blood requests with details
- **Request Management**: View and manage own requests
- **Status Updates**: Real-time updates on request progress
- **Donor Matching**: Automatic matching with compatible donors
- **Communication**: Connect with responding donors

### Common Features

- **User Dashboard**: Personalized dashboard for each user type
- **Profile Management**: Edit personal information and preferences
- **Responsive Design**: Works on all devices
- **Security**: Secure authentication and data protection
- **Real-time Updates**: Live status updates and notifications

## 🚀 Development & Deployment

### Development

```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
```

### Production Build

```bash
npm run build      # Creates optimized build in 'build' folder
```

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## 🔍 Testing

### Available Scripts

- `npm test`: Run unit tests
- `npm run test:coverage`: Run tests with coverage report

### Testing Strategy

- **Component Testing**: Individual component functionality
- **Integration Testing**: API communication and data flow
- **User Flow Testing**: Complete user journey testing

## 🎯 Future Enhancements

### Planned Features

- **Real-time Notifications**: WebSocket integration for live updates
- **Geolocation**: Location-based donor matching
- **Blood Bank Integration**: Connect with official blood banks
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Donation statistics and reporting
- **Multi-language Support**: Localization for different regions

### Technical Improvements

- **PWA Support**: Progressive Web App capabilities
- **Offline Mode**: Basic functionality without internet
- **Push Notifications**: Browser notifications for urgent requests
- **Advanced Filtering**: More sophisticated search and filter options

## 📄 License

This project is part of the BDAMS (Blood Donation & Management System) and is intended for educational and humanitarian purposes.

---

**Note**: This frontend is designed to work with the BDAMS backend API. Ensure the backend server is running on `http://localhost:8080` before starting the frontend application.
