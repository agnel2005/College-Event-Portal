import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ rating, message });
    // later → send to backend
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>


      {/* Navigation Bar */}
      <AppBar position="sticky" color="default" elevation={1}>
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  CampusEvents
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
                  <Button color="inherit" onClick={() => navigate('/addevent')}>Organize Events</Button>
                  <Button color="inherit" onClick={() => navigate('/findevents')}>Find Events</Button>
                  <Button color="inherit" onClick={() => navigate('/myevents')}>My Events</Button>
                  <Button color="inherit" onClick={() => navigate('/feedback')}>Feedback</Button>
                    <Button color="inherit" onClick={()=>navigate('/aboutus')}>About Us</Button>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Login</Button>
                  <Button variant="contained" color="primary" onClick={() => navigate('/signup')}>Sign Up</Button>
                </Stack>
              </Toolbar>
            </AppBar>

      {/* Header Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
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

export default Feedback;
