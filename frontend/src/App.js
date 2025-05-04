import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TripList from './components/trips/TripList';
import TripForm from './components/trips/TripForm';
import TripDetail from './components/trips/TripDetail';
import TripBlockDetail from './components/trips/TripBlockDetail';
import ActivityUpload from './components/admin/ActivityUpload';
import AdminDashboard from './components/admin/AdminDashboard';
import ActivityRecommendations from './components/activities/ActivityRecommendations';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Store the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/trips" replace />} />
                <Route path="trips" element={<PrivateRoute><TripList /></PrivateRoute>} />
                <Route path="trips/new" element={<PrivateRoute><TripForm /></PrivateRoute>} />
                <Route path="trips/:id" element={<PrivateRoute><TripDetail /></PrivateRoute>} />
                <Route path="trip-blocks/:id" element={<PrivateRoute><TripBlockDetail /></PrivateRoute>} />
                <Route path="activities" element={<PrivateRoute><ActivityRecommendations /></PrivateRoute>} />
              </Route>
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/activities" element={<PrivateRoute><ActivityUpload /></PrivateRoute>} />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
