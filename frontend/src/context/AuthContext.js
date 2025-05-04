import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the JWT token to get user info
        const decodedToken = jwtDecode(token);
        setUser({
          id: decodedToken.id,
          email: decodedToken.sub,
          role: decodedToken.role || 'USER'
        });
        
        // Set up axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password
      });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Decode token to get user info
      const decodedToken = jwtDecode(token);
      const userData = {
        id: decodedToken.id,
        email: decodedToken.sub,
        role: decodedToken.role || 'USER'
      };
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 