import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import ActivityForm from './ActivityForm';
import ItineraryForm from './ItineraryForm';
import TripBlockForm from './TripBlockForm';
import { format } from 'date-fns';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [tripBlocks, setTripBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityFormOpen, setActivityFormOpen] = useState(false);
  const [itineraryFormOpen, setItineraryFormOpen] = useState(false);
  const [tripBlockFormOpen, setTripBlockFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingTripBlock, setEditingTripBlock] = useState(null);
  const [expandedTripBlocks, setExpandedTripBlocks] = useState({});
  const [currentTripBlockId, setCurrentTripBlockId] = useState(null);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch trip details
      const tripResponse = await fetch(`/api/trips/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!tripResponse.ok) {
        throw new Error('Failed to fetch trip');
      }
      
      const tripData = await tripResponse.json();
      console.log('Fetched trip data:', tripData);
      setTrip(tripData);

      // Only fetch itinerary if it exists
      if (tripData.itinerary) {
        console.log('Trip has itinerary:', tripData.itinerary);
        setItinerary(tripData.itinerary);
        
        // Fetch trip blocks for this itinerary
        const blocksResponse = await fetch(`/api/itineraries/${tripData.itinerary.id}/trip-blocks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (blocksResponse.ok) {
          const blocksData = await blocksResponse.json();
          console.log('Fetched trip blocks:', blocksData);
          setTripBlocks(blocksData);
        } else if (blocksResponse.status !== 404) {
          throw new Error('Failed to fetch trip blocks');
        }
      } else {
        console.log('Trip has no itinerary');
        setItinerary(null);
        setTripBlocks([]);
      }
    } catch (err) {
      console.error('Error fetching trip data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const handleItineraryCreated = () => {
    fetchTripData();
  };

  const handleTripBlockCreated = () => {
    fetchTripData();
  };

  const handleActivityCreated = () => {
    fetchTripData();
  };

  const handleEditTripBlock = (tripBlock) => {
    setEditingTripBlock(tripBlock);
    setTripBlockFormOpen(true);
  };

  const handleDeleteTripBlock = async (tripBlockId) => {
    if (!window.confirm('Are you sure you want to delete this trip block? This will also delete all associated activities.')) {
      return;
    }

    try {
      const response = await fetch(`/api/trip-blocks/${tripBlockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete trip block');
      }

      fetchTripData();
    } catch (error) {
      console.error('Error deleting trip block:', error);
      alert(error.message || 'Failed to delete trip block');
    }
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setActivityFormOpen(true);
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }

      fetchTripData();
    } catch (error) {
      console.error('Error deleting activity:', error);
      setError(error.message);
    }
  };

  const toggleTripBlock = (tripBlockId) => {
    setExpandedTripBlocks(prev => ({
      ...prev,
      [tripBlockId]: !prev[tripBlockId]
    }));
  };

  const handleAddActivity = (tripBlockId) => {
    setCurrentTripBlockId(tripBlockId);
    setEditingActivity(null);
    setActivityFormOpen(true);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!trip) return <Typography>Trip not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {trip.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {trip.description}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Start Date</Typography>
              <Typography>{format(new Date(trip.startDate), 'MMM dd, yyyy')}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">End Date</Typography>
              <Typography>{format(new Date(trip.endDate), 'MMM dd, yyyy')}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {!itinerary && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setItineraryFormOpen(true)}
          >
            Create Itinerary
          </Button>
        </Box>
      )}

      {itinerary && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Trip Blocks</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setTripBlockFormOpen(true)}
            >
              Add Trip Block
            </Button>
          </Box>

          {tripBlocks.length === 0 ? (
            <Typography>No trip blocks yet. Add one to get started!</Typography>
          ) : (
            <List>
              {tripBlocks.map((tripBlock) => (
                <Paper key={tripBlock.id} sx={{ mb: 2 }}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditTripBlock(tripBlock)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteTripBlock(tripBlock.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="expand"
                          onClick={() => toggleTripBlock(tripBlock.id)}
                        >
                          {expandedTripBlocks[tripBlock.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={tripBlock.title}
                      secondary={`${format(new Date(tripBlock.startTime), 'MMM dd, yyyy h:mm a')} - ${format(new Date(tripBlock.endTime), 'MMM dd, yyyy h:mm a')}`}
                    />
                  </ListItem>
                  <Collapse in={expandedTripBlocks[tripBlock.id]}>
                    <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1">Activities</Typography>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddActivity(tripBlock.id)}
                        >
                          Add Activity
                        </Button>
                      </Box>
                      {tripBlock.activities && tripBlock.activities.length > 0 ? (
                        <List>
                          {tripBlock.activities.map((activity) => (
                            <ListItem
                              key={activity.id}
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
                                secondary={`${format(new Date(activity.startTime), 'h:mm a')} - ${format(new Date(activity.endTime), 'h:mm a')}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography>No activities yet. Add one to get started!</Typography>
                      )}
                    </Box>
                  </Collapse>
                </Paper>
              ))}
            </List>
          )}
        </Box>
      )}

      <ItineraryForm
        open={itineraryFormOpen}
        onClose={() => setItineraryFormOpen(false)}
        tripId={id}
        onSuccess={handleItineraryCreated}
      />

      <TripBlockForm
        open={tripBlockFormOpen}
        onClose={() => setTripBlockFormOpen(false)}
        itineraryId={itinerary?.id}
        tripBlock={editingTripBlock}
        onSuccess={handleTripBlockCreated}
      />

      <ActivityForm
        open={activityFormOpen}
        onClose={() => setActivityFormOpen(false)}
        tripBlockId={currentTripBlockId}
        activity={editingActivity}
        onSuccess={handleActivityCreated}
      />
    </Box>
  );
};

export default TripDetail; 