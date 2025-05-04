import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import dayjs from 'dayjs';

const ItineraryForm = ({ open, onClose, tripId, itinerary, onItineraryCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (itinerary) {
      setFormData({
        title: itinerary.title || '',
        description: itinerary.description || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
      });
    }
  }, [itinerary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = itinerary 
        ? `http://localhost:8080/api/itineraries/${itinerary.id}`
        : 'http://localhost:8080/api/itineraries';
      
      const response = await fetch(url, {
        method: itinerary ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          tripId: tripId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save itinerary');
      }

      onClose();
      onItineraryCreated();
    } catch (error) {
      console.error('Error saving itinerary:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {itinerary ? 'Edit Itinerary' : 'Create Itinerary'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {itinerary ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItineraryForm; 