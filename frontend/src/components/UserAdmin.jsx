// NOT IN USE ANYMORE - REPLACED DIRECTLY BY HOME.JSX


import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Container,
  Card,
  Grid,
  Paper
} from '@mui/material';
import { Person, AdminPanelSettings } from '@mui/icons-material';

const UserAdmin = () => {
  const navigate = useNavigate();

  // Student navigation handler - customize here
  const handleStudentClick = () => {
    navigate('/home', { state: { role: 'student' } });
  };

  // Admin navigation handler - customize here
  const handleAdminClick = () => {
    navigate('/login', { state: { role: 'admin' } });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              py: 5,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              CampusEvents
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Choose Your Role
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              textAlign="center"
              fontWeight="bold"
              mb={3}
            >
              Choose Your Experience
            </Typography>

            <Grid container spacing={2}>
              {/* STUDENT */}
              <Grid item xs={12}>
                <Paper
                  onClick={handleStudentClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2.5,
                    cursor: 'pointer',
                    transition: '0.3s',
                    border: '2px solid transparent',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 6px 20px rgba(25,118,210,0.2)',
                      bgcolor: '#f0f7ff'
                    }
                  }}
                >
                  <Person sx={{ fontSize: 48, color: 'primary.main' }} />
                  <Box>
                    <Typography fontWeight="bold">Student</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Explore events, register, and connect with campus activities
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* ADMIN */}
              <Grid item xs={12}>
                <Paper
                  onClick={handleAdminClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2.5,
                    cursor: 'pointer',
                    transition: '0.3s',
                    border: '2px solid transparent',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 6px 20px rgba(25,118,210,0.2)',
                      bgcolor: '#f0f7ff'
                    }
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.main' }} />
                  <Box>
                    <Typography fontWeight="bold">Admin</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage events, users, and system settings with full control
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default UserAdmin;
