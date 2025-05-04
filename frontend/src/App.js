import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from './context/AuthContext';
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

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Store the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user role from token
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  const isAdmin = tokenPayload.role === 'ADMIN';

  if (!isAdmin) {
    return <Navigate to="/trips" replace />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="admin/upload" element={<AdminRoute><ActivityUpload /></AdminRoute>} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
