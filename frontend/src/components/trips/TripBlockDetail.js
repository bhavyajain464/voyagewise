import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Collapse,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Lightbulb as LightbulbIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import ActivityForm from './ActivityForm';
import TripBlockForm from './TripBlockForm';

const TripBlockDetail = ({ tripBlock, onUpdate, onDelete }) => {
  const [openActivityForm, setOpenActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingTripBlock, setEditingTripBlock] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [openRecommendations, setOpenRecommendations] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    location: '',
    category: ''
  });

  const handleDeleteActivity = async (activityId) => {
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setOpenActivityForm(true);
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    setOpenActivityForm(true);
  };

  const handleEditTripBlock = () => {
    setEditingTripBlock(true);
  };

  const handleDeleteTripBlock = async () => {
    if (!window.confirm('Are you sure you want to delete this trip block? This will also delete all associated activities.')) {
      return;
    }
    onDelete();
  };

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const response = await fetch('/api/activities/recommendations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleShowRecommendations = () => {
    fetchRecommendations();
    setOpenRecommendations(true);
  };

  const handleAddRecommendedActivity = (recommendation) => {
    const newActivity = {
      title: recommendation.title,
      description: recommendation.description,
      location: recommendation.location,
      category: recommendation.category,
      startTime: tripBlock.startTime,
      endTime: tripBlock.endTime,
      tripBlockId: tripBlock.id
    };
    setOpenActivityForm(true);
    setOpenRecommendations(false);
    setEditingActivity({ ...newActivity, isNew: true });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getUniqueValues = (key) => {
    const values = recommendations.map(rec => rec[key]).filter(Boolean);
    return [...new Set(values)];
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.country && rec.country !== filters.country) return false;
    if (filters.location && rec.location !== filters.location) return false;
    if (filters.category && rec.category !== filters.category) return false;
    return true;
  });

  if (!tripBlock) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <ListItem
        secondaryAction={
          <Box>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={handleEditTripBlock}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={handleDeleteTripBlock}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="expand"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        }
      >
        <ListItemText
          primary={tripBlock.title}
          secondary={`${format(new Date(tripBlock.startTime), 'PPp')} - ${format(new Date(tripBlock.endTime), 'PPp')}`}
        />
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {tripBlock.location}, {tripBlock.country}
          </Typography>
          <Typography variant="body1" paragraph>
            {tripBlock.description}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Activities</Typography>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LightbulbIcon />}
                  onClick={handleShowRecommendations}
                  sx={{ mr: 1 }}
                >
                  Get Recommendations
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddActivity}
                >
                  Add Activity
                </Button>
              </Box>
            </Box>
            {tripBlock.activities?.length > 0 ? (
              <List>
                {tripBlock.activities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem
                      secondaryAction={
                        <Box>
                          <IconButton 
                            edge="end" 
                            aria-label="edit"
                            onClick={() => handleEditActivity(activity)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteActivity(activity.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {activity.location} - {activity.category}
                            </Typography>
                            <br />
                            {format(new Date(activity.startTime), 'PPp')} - {format(new Date(activity.endTime), 'PPp')}
                            <br />
                            {activity.description}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No activities yet. Add one to get started!</Typography>
            )}
          </Box>
        </Box>
      </Collapse>

      <ActivityForm
        open={openActivityForm}
        onClose={() => setOpenActivityForm(false)}
        tripBlockId={tripBlock.id}
        activity={editingActivity}
        onSuccess={() => {
          setOpenActivityForm(false);
          onUpdate();
        }}
      />

      <TripBlockForm
        open={editingTripBlock}
        onClose={() => setEditingTripBlock(false)}
        tripBlock={tripBlock}
        onSuccess={() => {
          setEditingTripBlock(false);
          onUpdate();
        }}
      />

      <Dialog
        open={openRecommendations}
        onClose={() => setOpenRecommendations(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Activity Recommendations</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Country"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">All Countries</option>
                  {getUniqueValues('country').map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">All Locations</option>
                  {getUniqueValues('location').map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">All Categories</option>
                  {getUniqueValues('category').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {loadingRecommendations ? (
            <Typography>Loading recommendations...</Typography>
          ) : filteredRecommendations.length > 0 ? (
            <List>
              {filteredRecommendations.map((recommendation) => (
                <ListItem
                  key={recommendation.id}
                  secondaryAction={
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddRecommendedActivity(recommendation)}
                    >
                      Add to Trip
                    </Button>
                  }
                >
                  <ListItemText
                    primary={recommendation.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {recommendation.location} - {recommendation.category}
                        </Typography>
                        <br />
                        {recommendation.description}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No recommendations available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setFilters({ country: '', location: '', category: '' });
            setOpenRecommendations(false);
          }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TripBlockDetail; 