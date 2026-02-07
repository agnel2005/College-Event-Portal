import React, { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Protect route + load user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/login');
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  }, [navigate]);

  // Prevent render until user is loaded
  if (!user) return null;
  return (
    <div>



      {/* Navigation Bar */}
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
      </AppBar>
    </div>
  )
}

export default Navbar