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
  MenuItem,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const AddEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    venue: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // later → send request to backend (pending approval)
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

      {/* Event Request Form */}
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Event Details
              </Typography>

              <TextField
                label="Event Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
              />

              <TextField
                select
                label="Event Category"
                name="category"
                fullWidth
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value="Stall">Stall</MenuItem>
                <MenuItem value="Games">Games</MenuItem>
                <MenuItem value="Tech Talk">Tech Talk</MenuItem>
                <MenuItem value="Workshop">Workshop</MenuItem>
                <MenuItem value="Club Event">Club Event</MenuItem>

                <MenuItem value="Cultural">Cultural</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>

              <TextField
                type="date"
                label="Event Date"
                name="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formData.date}
                onChange={handleChange}
              />

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
                placeholder="Brief description, objectives, and requirements"
              />

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
