import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

const AboutUs = () => {

  //--------------------------------------- user aware
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  //---------------------------------------------------
  // ---------------------------------------------------- user aware
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
  // -------------------------------------------------------------------------

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>


      <Navbar />



      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #23355eff 100%)',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
            About CampusEvents
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Simplifying campus event management for students and staff
          </Typography>
        </Container>
      </Box>

      {/* About Content */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
                  Our Mission
                </Typography>
                <Typography color="text.secondary">
                  CampusEvents was built to bring all college events under one
                  unified platform. From technical symposiums to cultural fests,
                  we aim to make discovering, organizing, and managing events
                  effortless for everyone on campus.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
                  Why CampusEvents?
                </Typography>
                <Typography color="text.secondary">
                  Traditional notice boards and scattered WhatsApp messages
                  often lead to missed opportunities. CampusEvents centralizes
                  everything—registrations, approvals, updates, and feedback—
                  into one reliable system.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
                  Built for Colleges
                </Typography>
                <Typography color="text.secondary">
                  This platform is designed with real campus needs in mind.
                  Students can easily find and register for events, while
                  faculty and administrators can manage approvals, participation,
                  and communication seamlessly—all within a secure system.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default AboutUs;
