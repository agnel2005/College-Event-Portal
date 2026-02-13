// frontend/src/components/AddEvent.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Box,
  Stack,
  TextField,
  Card,
  CardContent,
  MenuItem,
  Paper,
} from '@mui/material';
import { ArrowBack, CloudUpload } from '@mui/icons-material';
import Navbar from './Navbar';
import { toast } from 'react-hot-toast';


const AddEvent = () => {
  const navigate = useNavigate();

  // 🔐 logged-in user check (UNCHANGED)
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    venue: '',
    description: '',
    poster_image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, poster_image: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, poster_image: null });
    setImagePreview(null);
  };

  // ✅ FINAL POST LOGIC With Image Upload Explanation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 📦 FORM DATA EXPLANATION:
    // Normally we send JSON data. typically application/json
    // BUT, JSON cannot handle binary files (like images).
    // So we use "FormData" which allows us to send Key-Value pairs, including Files.
    // The browser automatically sets the header "Content-Type: multipart/form-data".
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      // Append each field to the payload.
      // If 'value' is an image file (from handleImageChange), it gets attached as binary data.
      if (value) payload.append(key, value);
    });

    payload.append('created_by', user.id); // Linking the event to the logged-in student

    try {
      const response = await fetch(
        'http://localhost:8000/api/events/create/',
        {
          method: 'POST',
          body: payload, // Sending the FormData object
        }
      );

      const text = await response.text(); // 👈 DEBUG SAFE


      if (response.ok) {
        toast.success('Event request submitted successfully! ✅');
        navigate('/myevents');

      } else {
        console.error(text);
        toast.error('Failed to submit event request');
      }

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }

  };


  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
            Request an Event
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Submit your event proposal for approval
          </Typography>
        </Container>
      </Box>

      {/* Form */}
      <Container maxWidth="sm" sx={{ py: 8, flexGrow: 1 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            {/* ... form content ... */}
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight="bold">
                Event Details
              </Typography>

              <TextField
                label="Event Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
              />
              {/* ... truncated for brevity, we can just replace the wrapper and append footer ... */}
              {/* simpler approach: just replace the surrounding tags if possible, or just the bottom part if the top part is too large */}


              <TextField
                select
                label="Event Category"
                name="category"
                fullWidth
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value="Stayback">Stayback</MenuItem>
                <MenuItem value="Stall">Stall</MenuItem>
                <MenuItem value="Games">Games</MenuItem>
                <MenuItem value="Tech Talk">Tech Talk</MenuItem>
                <MenuItem value="Workshop">Workshop</MenuItem>
                <MenuItem value="Club Event">Club Event</MenuItem>
                <MenuItem value="Cultural">Cultural</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  type="date"
                  label="Start Date"
                  name="start_date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={formData.start_date}
                  onChange={handleChange}
                />
                <TextField
                  type="date"
                  label="End Date"
                  name="end_date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  type="time"
                  label="Start Time"
                  name="start_time"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={formData.start_time}
                  onChange={handleChange}
                />
                <TextField
                  type="time"
                  label="End Time"
                  name="end_time"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={formData.end_time}
                  onChange={handleChange}
                />
              </Stack>

              <TextField
                label="Venue"
                name="venue"
                fullWidth
                value={formData.venue}
                onChange={handleChange}
              />

              <TextField
                label="Event Description"
                name="description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={handleChange}
              />

              <Box>
                <Typography fontWeight="bold" mb={1}>
                  Event Poster (Optional)
                </Typography>
                <Paper
                  variant="outlined"
                  component="label"
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                  }}
                >
                  <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                  <CloudUpload sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Click to upload image
                  </Typography>
                </Paper>

                {imagePreview && (
                  <Box mt={2}>
                    <Box
                      component="img"
                      src={imagePreview}
                      sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 2 }}
                    />
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/home')}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  sx={{ fontWeight: 'bold' }}
                  onClick={handleSubmit}
                >
                  Submit Request
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
      {/* Footer */}
      <Box sx={{ bgcolor: '#222', color: 'grey.500', py: 6, mt: 8 }}>
        <Container align="center">
          <Typography variant="body1">
            © 2026 CampusEvents Management Portal
          </Typography>
          <Typography variant="body2">
            Designed for students, by students.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AddEvent;
