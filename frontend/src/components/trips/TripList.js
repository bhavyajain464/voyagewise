import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          navigate('/login');
          return;
        }

        console.log('Fetching trips with token:', token);
        console.log('Making request to /api/trips');

        const response = await fetch('/api/trips', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized - removing token and redirecting to login');
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Fetched trips data:', data);
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading trips...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Trips
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/trips/new')}
        >
          New Trip
        </Button>
      </Box>
      <Grid container spacing={3}>
        {trips.map((trip) => (
          <Grid item xs={12} sm={6} md={4} key={trip.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
              onClick={() => navigate(`/trips/${trip.id}`)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {trip.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {trip.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {trips.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="text.secondary">
              No trips found. Create your first trip!
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TripList; 