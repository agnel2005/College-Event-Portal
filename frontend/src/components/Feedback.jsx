import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
// ... rest of imports
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  TextField,
  Card,
  CardContent,
  Rating,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const Feedback = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');

  // 🔐 Protect route - similar to other pages
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/feedback/submit/', {
        username: user.username,
        rating,
        message,
      });
      toast.success("Thank you for your feedback!");
      setRating(0);
      setMessage('');
      setTimeout(() => navigate('/home'), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit feedback");
    }
  };

  // Prevent render until user is loaded
  if (!user) return null;

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>

      <Navbar />

      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #23355eff 100%)',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
            We Value Your Feedback
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Help us improve your campus event experience
          </Typography>
        </Container>
      </Box>

      {/* Feedback Form */}
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Share your thoughts
              </Typography>

              <Box>
                <Typography gutterBottom>Overall Experience</Typography>
                <Rating
                  value={rating}
                  onChange={(e, newValue) => setRating(newValue)}
                  size="large"
                />
              </Box>

              <TextField
                label="Your Feedback"
                multiline
                rows={4}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you liked or what we can improve..."
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/home    ')}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ fontWeight: 'bold' }}
                >
                  Submit Feedback
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Feedback;
