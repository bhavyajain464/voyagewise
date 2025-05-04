import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Grid,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const TripBlockForm = ({ open, onClose, itineraryId, onSuccess, tripBlock }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    country: '',
    startTime: dayjs(),
    endTime: dayjs().add(1, 'day'),
  });

  useEffect(() => {
    if (tripBlock) {
      setFormData({
        title: tripBlock.title || '',
        description: tripBlock.description || '',
        location: tripBlock.location || '',
        country: tripBlock.country || '',
        startTime: dayjs(tripBlock.startTime),
        endTime: dayjs(tripBlock.endTime),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        country: '',
        startTime: dayjs(),
        endTime: dayjs().add(1, 'day'),
      });
    }
  }, [tripBlock]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateTimeChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = tripBlock 
        ? `http://localhost:8080/api/trip-blocks/${tripBlock.id}`
        : 'http://localhost:8080/api/trip-blocks';
      
      const method = tripBlock ? 'PUT' : 'POST';

      const requestBody = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        location: formData.location,
        country: formData.country,
      };

      // Add itineraryId only if it's provided (for create) or use the existing one (for update)
      if (tripBlock) {
        requestBody.itineraryId = tripBlock.itineraryId;
      } else if (itineraryId) {
        requestBody.itineraryId = itineraryId;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(tripBlock ? 'Failed to update trip block' : 'Failed to create trip block');
      }

      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h5" component="div">
            {tripBlock ? 'Edit Trip Block' : 'Add New Trip Block'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  fullWidth
                  name="title"
                  label="Title"
                  variant="outlined"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="location"
                  label="Location"
                  variant="outlined"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="country"
                  label="Country"
                  variant="outlined"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start Time"
                    value={formData.startTime}
                    onChange={(newValue) => handleDateTimeChange('startTime', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="End Time"
                    value={formData.endTime}
                    onChange={(newValue) => handleDateTimeChange('endTime', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    minDateTime={formData.startTime}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {tripBlock ? 'Update Trip Block' : 'Create Trip Block'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TripBlockForm; 