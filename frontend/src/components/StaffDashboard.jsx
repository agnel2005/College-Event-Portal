// frontend/src/components/StaffDashboard.jsx


import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import {
  EventNote,
  People,
  Insights as InsightsIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';

const StaffDashboard = () => {
  // ------------------------------------------------------------

  //  const storedUser = localStorage.getItem('user');
  //     // let user = null;

  //     if (storedUser) {
  //         try {
  //             user = JSON.parse(storedUser);
  //         } catch (error) {
  //             console.error("Invalid user data in localStorage", error);
  //             localStorage.removeItem('user');
  //         }
  //     }

  //     // 1. Not logged in -> Redirect to Login
  //     if (!user) {
  //         return <navigate to="/login" replace />;
  //     }



  // -----------------------------------------------------------
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // 🔐 Route protection
  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/login');
    }
  }, [user, navigate]);

  const cards = [
    {
      title: 'Manage Event Requests',
      description: 'Approve or reject student event requests',
      icon: <EventNote sx={{ fontSize: 50, color: 'primary.main' }} />,
      path: '/manage-events',
    },
    {
      title: 'Manage Students',
      description: 'View and remove registered students',
      icon: <People sx={{ fontSize: 50, color: 'primary.main' }} />,
      path: '/manage-users',
    },
    {
      title: 'Insights',
      description: 'View statistics and system overview',
      icon: <InsightsIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      path: '/insights',
    },
    {
      title: 'Student Feedback',
      description: 'View feedback submitted by students',
      icon: <FeedbackIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      path: '/view-feedback',
    },
  ];


  // logout button handler
  const handleLogout = () => {
    console.log("👋 Staff logged out");

    localStorage.removeItem('user'); // clear login state
    navigate('/login');              // go back to login page
  };





  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>

      {/* NAVBAR */}
      {/* NAVBAR */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

          <Typography variant="h6" fontWeight="bold">
            CampusEvents · Staff
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/staff-profile')}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>

        </Toolbar>
      </AppBar>

      {/* HERO SECTION */}
      <Box
        sx={{
          bgcolor: 'white',
          py: 6,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user.first_name} {user.last_name} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage event requests, students, and view system insights from here.
          </Typography>
        </Container>
      </Box>

      {/* DASHBOARD CARDS */}
      <Container sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item xs={12} md={4} key={card.title}>
              <Card
                sx={{
                  height: '100%',
                  transition: '0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(card.path)}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{card.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.description}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StaffDashboard;
