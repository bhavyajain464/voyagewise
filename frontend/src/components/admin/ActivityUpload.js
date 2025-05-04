import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Alert, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ActivityUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    } else {
      setFile(null);
      setMessage({ type: 'error', text: 'Please select a valid CSV file' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/admin/activities/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ 
          type: 'success', 
          text: `Successfully uploaded ${data.length} activities` 
        });
        setFile(null);
        navigate('/admin');
      } else {
        const error = await response.json();
        setMessage({ 
          type: 'error', 
          text: error.message || 'Failed to upload activities' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error uploading file. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Upload Activity Catalog
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Upload a CSV file containing activity recommendations. The file should include the following columns:
            title, description, location, country, category, typical_duration_minutes, average_cost, tags, is_popular, recommended_time
          </Typography>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              Select CSV File
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileChange}
              />
            </Button>

            {file && (
              <Typography variant="body2">
                Selected: {file.name}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityUpload; 