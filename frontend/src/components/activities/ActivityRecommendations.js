import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Chip,
  CircularProgress,
  Rating,
  Divider
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ActivityRecommendations = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    country: '',
    location: '',
    tags: []
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    fetchActivities();
    fetchFilters();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:8080/api/activities';
      const params = new URLSearchParams();
      
      if (filters.country) params.append('country', filters.country);
      if (filters.location) params.append('location', filters.location);
      if (filters.tags.length > 0) params.append('tags', filters.tags.join(','));

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setActivities(response.data.slice(0, 10)); // Get top 10 activities
    } catch (err) {
      setError('Failed to fetch activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/activities/filters');
      const { tags, locations, countries } = response.data;
      setAvailableTags(tags);
      setAvailableLocations(locations);
      setAvailableCountries(countries);
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Activity Recommendations
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={availableCountries}
            value={filters.country}
            onChange={(event, newValue) => handleFilterChange('country', newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Country" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={availableLocations}
            value={filters.location}
            onChange={(event, newValue) => handleFilterChange('location', newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Location" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            multiple
            options={availableTags}
            value={filters.tags}
            onChange={(event, newValue) => handleFilterChange('tags', newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Tags" fullWidth />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  size="small"
                />
              ))
            }
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {activities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {activity.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {activity.description}
                </Typography>
                <Box sx={{ my: 1 }}>
                  <Typography variant="body2">
                    <strong>Location:</strong> {activity.location}, {activity.country}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Category:</strong> {activity.category}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {activity.typicalDurationMinutes} minutes
                  </Typography>
                  <Typography variant="body2">
                    <strong>Average Cost:</strong> ${activity.averageCost}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Recommended Time:</strong> {activity.recommendedTime}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  {activity.tags.split(',').map((tag) => (
                    <Chip
                      key={tag}
                      label={tag.trim()}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                {activity.isPopular && (
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label="Popular"
                      color="primary"
                      size="small"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActivityRecommendations; 