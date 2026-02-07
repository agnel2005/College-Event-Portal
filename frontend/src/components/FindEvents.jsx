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
} from '@mui/material';




import { useNavigate } from 'react-router-dom';

const FindEvents = () => {
  const navigate = useNavigate();

  // 🔐 get logged-in user
  const user = JSON.parse(localStorage.getItem('user'));

  // 📦 all approved events
  const [events, setEvents] = useState([]);

  // 🔍 search input
  const [search, setSearch] = useState('');

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
      <Container sx={{ mt: 5, flexGrow: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Approved College Events
        </Typography>

        {/* 🔍 SEARCH BAR */}
        <TextField
          fullWidth
          placeholder="Search events by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
        />

        {/* 📦 EVENTS GRID */}
        {filteredEvents.length === 0 ? (
          <Typography color="text.secondary">
            No events found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card sx={{ height: '100%', borderRadius: 3 }}>

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

                  <CardContent>

                    <Typography variant="h6" fontWeight="bold">
                      {event.title}
                    </Typography>

                    <Chip
                      label={event.category}
                      size="small"
                      sx={{ mt: 1, mb: 2 }}
                    />

                    <Typography variant="body2">
                      <strong>Date:</strong>{' '}
                      {event.start_date} → {event.end_date}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Time:</strong>{' '}
                      {event.start_time} → {event.end_time}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Venue:</strong> {event.venue}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ mt: 1 }}
                      color="text.secondary"
                    >
                      {event.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
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

export default FindEvents;
