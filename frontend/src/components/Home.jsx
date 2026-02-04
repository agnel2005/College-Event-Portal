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
} from '@mui/material';
import { Event, Groups, HistoryEdu } from '@mui/icons-material';
import Navbar from './Navbar.jsx';

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
          bgcolor: 'primary.main',
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
            Welcome, {user.first_name} 👋
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
              sx={{ fontWeight: 'bold' }}
            >
              Find Events
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/addevent')}
              size="large"
              color="inherit"
            >
              Organize an Event
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} textAlign="center">
          <Grid item xs={12} md={4}>
            <Event color="primary" sx={{ fontSize: 50 }} />
            <Typography variant="h6" mt={2}>
              50+ Active Events
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Live workshops, seminars, and competitions.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Groups color="primary" sx={{ fontSize: 50 }} />
            <Typography variant="h6" mt={2}>
              120+ Clubs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connecting diverse student communities.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <HistoryEdu color="primary" sx={{ fontSize: 50 }} />
            <Typography variant="h6" mt={2}>
              Easy Registration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              One-click RSVP with your student ID.
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

          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item key={item} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={`https://source.unsplash.com/random/400x200?event&sig=${item}`}
                    alt="event"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Annual Tech Symposium {item}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Join the biggest gathering of tech enthusiasts. Workshops
                      on AI, Web3, and Robotics.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 2,
                        color: 'primary.main',
                        fontWeight: 'bold',
                      }}
                    >
                      Oct 24, 2026 • Main Auditorium
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button fullWidth variant="outlined" size="small">
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

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
    </>
  );
};

export default Home;
