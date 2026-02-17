// frontend/src/components/FindEvents.jsx

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';

import Footer from './Footer';


import { useNavigate } from 'react-router-dom';

const FindEvents = () => {
  const navigate = useNavigate();

  // 🔐 get logged-in user
  const user = JSON.parse(localStorage.getItem('user'));

  // 📦 all approved events
  const [events, setEvents] = useState([]);

  // 🔍 search input
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 🔐 protect route (students only)
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  // 📥 fetch events from backend
  const fetchEvents = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/events/');
      const data = await res.json();

      // 🧠 keep ONLY approved events
      const approvedEvents = data.filter(
        (event) => event.approval_status === 'approved'
      );

      setEvents(approvedEvents);
    } catch (err) {
      console.error('❌ Failed to fetch events', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔍 apply search filter (case-insensitive)
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      {/* 🔝 NAVBAR */}
      <Navbar />

      {/* 📋 CONTENT */}
      <Container sx={{ mt: 5, mb: 5, flexGrow: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Approved College Events
        </Typography>

        {/* 🔍 SEARCH BAR */}
        <TextField
          fullWidth
          placeholder="Search events by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4, bgcolor: 'white', borderRadius: 1 }}
        />

        {/* 📦 EVENTS GRID */}
        {filteredEvents.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
            No events found matching your search.
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => setSelectedEvent(event)}
                >

                  {/* 🖼️ Event Poster */}
                  {event.poster_image && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={
                        event.poster_image.startsWith('http')
                          ? event.poster_image
                          : event.poster_image.startsWith('/media/')
                            ? `http://127.0.0.1:8000${event.poster_image}`
                            : `http://127.0.0.1:8000/media/${event.poster_image.startsWith('/') ? event.poster_image.slice(1) : event.poster_image}`
                      }
                      alt={event.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {event.title}
                    </Typography>

                    <Chip
                      label={event.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
                    </Typography>

                    <Stack spacing={1} mt={1}>
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
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}>
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Footer */}
      <Footer />



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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FindEvents;
