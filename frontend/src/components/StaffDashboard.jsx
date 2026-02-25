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
      {/* NAVBAR */}
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }} elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

          <Typography variant="h6" fontWeight="bold" color="inherit">
            CampusEvents · Staff
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => navigate('/staff-profile')}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Logout
            </Button>
          </Stack>

        </Toolbar>
      </AppBar>

      {/* HERO SECTION */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user.first_name} {user.last_name} 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Manage event requests, students, and view system insights from here.
          </Typography>
        </Container>
      </Box>

      {/* DASHBOARD CARDS */}
      <Container sx={{ mt: 6, mb: 8 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          {cards.map((card) => (
            <Card
              key={card.title}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: '0.3s',
                cursor: 'pointer',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>{card.icon}</Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    minHeight: '2.4em', // Space for 1-2 lines
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    minHeight: '3em', // Space for 2 lines
                    flexGrow: 1
                  }}
                >
                  {card.description}
                </Typography>
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(card.path);
                    }}
                  >
                    Open
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default StaffDashboard;
