import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Event, Groups, HistoryEdu } from '@mui/icons-material';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Protect route + load user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/events/approved/');
        if (res.ok) {
          const data = await res.json();
          setFeaturedEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch featured events", error);
      }
    };
    fetchFeatured();
  }, []);

  // Prevent render until user is loaded
  if (!user) return null;

  return (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>

        {/* Navigation Bar
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            CampusEvents
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={() => navigate('/home')}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate('/addevent')}>
              Organize Events
            </Button>
            <Button color="inherit" onClick={() => navigate('/findevents')}>
              Find Events
            </Button>
            <Button color="inherit" onClick={() => navigate('/myevents')}>
              My Events
            </Button>
            <Button color="inherit" onClick={() => navigate('/feedback')}>
              Feedback
            </Button>
            <Button color="inherit" onClick={() => navigate('/aboutus')}>
              About Us
            </Button>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/profile')}
            >
              Profile
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar> */}

        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0f172a 0%, #23355eff 100%)',
            color: 'white',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 800 }}
            >
              Welcome, {user.first_name}
            </Typography>

            <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
              From hackathons to cultural fests—discover, register, and organize
              events all in one place.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                onClick={() => navigate('/findevents')}
                size="large"
                color="secondary"
                sx={{
                  fontWeight: 'bold', fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '50px',
                  px: 3,
                  background: 'linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)',
                  boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 20px 0 rgba(25, 118, 210, 0.23)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Find Events
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/addevent')}
                size="large"
                color="inherit"
                sx={{
                  fontWeight: 'bold', fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '50px',
                  px: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Organize an Event
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* Features Section */}
        <Container sx={{ py: 8 }}>
          <Grid container spacing={4} textAlign="center" justifyContent="center">
            <Grid item xs={12} md={4}>
              <Event color="primary" sx={{ fontSize: 50 }} />
              <Typography variant="h6" mt={2}>
                View Active Events
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live workshops, seminars, and competitions.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Groups color="primary" sx={{ fontSize: 50 }} />
              <Typography variant="h6" mt={2}>
                Centralised Portal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organize all your events in a single place.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <HistoryEdu color="primary" sx={{ fontSize: 50 }} />
              <Typography variant="h6" mt={2}>
                Easy Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                One-click Registration with your university Email.
              </Typography>
            </Grid>
          </Grid>
        </Container>

        {/* Featured Events */}
        <Box sx={{ bgcolor: 'white', py: 8 }}>
          <Container>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ mb: 6, fontWeight: 'bold' }}
            >
              Featured Events
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {featuredEvents.length > 0 ? (
                featuredEvents.map((event) => (
                  <Grid item key={event.id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        transition: '0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6,
                        },
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={
                          event.poster_image
                            ? (event.poster_image.startsWith('http') ? event.poster_image : `http://127.0.0.1:8000${event.poster_image}`)
                            : `https://source.unsplash.com/random/400x200?event&sig=${event.id}`
                        }
                        alt={event.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          sx={{ fontWeight: 'bold', color: 'primary.main' }}
                        >
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
                        </Typography>

                        <Stack spacing={1} mt={2}>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                            📅 {event.start_date}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                            📍 {event.venue}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                            📞 Contact: {event.created_by.phone_no || 'N/A'}
                          </Typography>
                        </Stack>

                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button fullWidth variant="outlined" size="small" onClick={(e) => {
                          e.stopPropagation(); // fetch details without triggering card click twice if needed
                          setSelectedEvent(event);
                        }}>
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="h6" color="text.secondary" sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                  No featured events available at the moment.
                </Typography>
              )}
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>

      {/* Event Details Dialog */}
      <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent dividers>
          {selectedEvent && (
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {selectedEvent.title}
              </Typography>

              <Typography>
                <strong>Category:</strong> {selectedEvent.category}
              </Typography>

              <Typography>
                <strong>Hosted By:</strong> {selectedEvent.created_by.first_name} {selectedEvent.created_by.last_name} ({selectedEvent.created_by.department})
                <br />
                <strong>Contact:</strong> {selectedEvent.created_by.phone_no || 'N/A'}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2"><strong>📅 Date:</strong> {selectedEvent.start_date} → {selectedEvent.end_date}</Typography>
              </Stack>
              <Typography variant="body2"><strong>⏰ Time:</strong> {selectedEvent.start_time} - {selectedEvent.end_time}</Typography>
              <Typography variant="body2"><strong>📍 Venue:</strong> {selectedEvent.venue}</Typography>

              <Typography>
                <strong>Description:</strong><br />
                {selectedEvent.description}
              </Typography>

              {selectedEvent.poster_image && (
                <Box
                  component="a"
                  href={selectedEvent.poster_image.startsWith('http') ? selectedEvent.poster_image : `http://127.0.0.1:8000${selectedEvent.poster_image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'block', mt: 2 }}
                >
                  <Box
                    component="img"
                    src={selectedEvent.poster_image.startsWith('http') ? selectedEvent.poster_image : `http://127.0.0.1:8000${selectedEvent.poster_image}`}
                    alt="Event Poster"
                    sx={{ width: '100%', borderRadius: 2 }}
                  />
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)}>Close</Button>
          {/* Could add a 'Register' button here in future */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
