import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Activity Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/admin/upload"
              sx={{ mt: 2 }}
            >
              Upload Activities
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 