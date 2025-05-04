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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import ActivityForm from './ActivityForm';

const TripBlockDetail = () => {
  const { id } = useParams();
  const [tripBlock, setTripBlock] = useState(null);
  const [openActivityForm, setOpenActivityForm] = useState(false);

  useEffect(() => {
    fetchTripBlockDetails();
  }, [id]);

  const fetchTripBlockDetails = async () => {
    try {
      const response = await fetch(`/api/trip-blocks/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTripBlock(data);
      }
    } catch (error) {
      console.error('Error fetching trip block details:', error);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        fetchTripBlockDetails();
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  if (!tripBlock) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {tripBlock.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {tripBlock.location}, {tripBlock.country}
          </Typography>
          <Typography variant="body1" paragraph>
            {tripBlock.description}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Start Time</Typography>
              <Typography>
                {format(new Date(tripBlock.startTime), 'PPpp')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">End Time</Typography>
              <Typography>
                {format(new Date(tripBlock.endTime), 'PPpp')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Activities</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenActivityForm(true)}
          >
            Add Activity
          </Button>
        </Box>
        <List>
          {tripBlock.activities?.map((activity) => (
            <React.Fragment key={activity.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton edge="end" aria-label="edit">
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
                      {format(new Date(activity.startTime), 'p')} - {format(new Date(activity.endTime), 'p')}
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
      </Box>

      <ActivityForm
        open={openActivityForm}
        onClose={() => setOpenActivityForm(false)}
        tripBlockId={id}
        onSuccess={() => {
          setOpenActivityForm(false);
          fetchTripBlockDetails();
        }}
      />
    </Box>
  );
};

export default TripBlockDetail; 