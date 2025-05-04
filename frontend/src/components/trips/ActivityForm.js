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
  MenuItem,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const ActivityForm = ({ open, onClose, tripBlockId, activity, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    startTime: dayjs(),
    endTime: dayjs().add(1, 'hour'),
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        description: activity.description || '',
        location: activity.location || '',
        category: activity.category || '',
        startTime: activity.startTime ? dayjs(activity.startTime) : dayjs(),
        endTime: activity.endTime ? dayjs(activity.endTime) : dayjs().add(1, 'hour'),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        category: '',
        startTime: dayjs(),
        endTime: dayjs().add(1, 'hour'),
      });
    }
  }, [activity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = activity 
        ? `/api/activities/${activity.id}`
        : '/api/activities';
      
      console.log('Submitting activity form:', {
        ...formData,
        tripBlockId,
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
      });

      const response = await fetch(url, {
        method: activity ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          tripBlockId: tripBlockId,
          startTime: formData.startTime.toISOString(),
          endTime: formData.endTime.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save activity');
      }

      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error saving activity:', error);
      alert(error.message || 'Failed to save activity');
    }
  };

  const categories = [
    'Sightseeing',
    'Food',
    'Shopping',
    'Entertainment',
    'Transportation',
    'Accommodation',
    'Other'
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {activity ? 'Edit Activity' : 'Add Activity'}
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
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Start Time"
                value={formData.startTime}
                onChange={(newValue) => handleDateTimeChange('startTime', newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="End Time"
                value={formData.endTime}
                onChange={(newValue) => handleDateTimeChange('endTime', newValue)}
                minDateTime={formData.startTime}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {activity ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityForm; 