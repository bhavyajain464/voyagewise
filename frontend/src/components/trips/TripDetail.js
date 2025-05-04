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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, ArrowForward as ArrowForwardIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import ActivityForm from './ActivityForm';
import ItineraryForm from './ItineraryForm';
import TripBlockForm from './TripBlockForm';
import { format } from 'date-fns';
import TripBlockDetail from './TripBlockDetail';
import TripCalendar from './TripCalendar';

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
  const [expandedTripBlocks, setExpandedTripBlocks] = useState({});
  const [currentTripBlockId, setCurrentTripBlockId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

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

  const handleTripBlockUpdated = () => {
    fetchTripData();
  };

  const handleTripBlockDeleted = () => {
    fetchTripData();
  };

  const handleActivityCreated = () => {
    fetchTripData();
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
      {trip && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {trip.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {trip.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">
                {format(new Date(trip.startDate), 'PP')} - {format(new Date(trip.endDate), 'PP')}
              </Typography>
              {itinerary && (
                <Button
                  variant="outlined"
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {showCalendar && tripBlocks.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <TripCalendar tripBlocks={tripBlocks} />
        </Box>
      )}

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
                <TripBlockDetail
                  key={tripBlock.id}
                  tripBlock={tripBlock}
                  onUpdate={handleTripBlockUpdated}
                  onDelete={handleTripBlockDeleted}
                />
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