import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
} from '@mui/material';
import AuthBackground from './AuthBackground';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      const from = location.state?.from?.pathname || '/trips';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <AuthBackground>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Welcome to VoyageWise
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Your journey begins here
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Button
                    component={Link}
                    to="/register"
                    variant="text"
                    color="primary"
                  >
                    Register here
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </AuthBackground>
  );
};

export default Login; 