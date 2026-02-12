import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from '@mui/icons-material';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Avatar,
  Chip,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person,
  Email,
  Badge,
  School,
  AccountCircle,
} from '@mui/icons-material';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Protect route + load user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  // Generate initials for avatar
  const getInitials = () => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  // Generate avatar color based on username
  const getAvatarColor = () => {
    const colors = ['#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#f57c00', '#0097a7'];
    const index = user.username?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>

      {/* Navigation Bar - Matching Home */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: isTablet ? 'wrap' : 'nowrap' }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: 'primary.main', mb: isTablet ? 1 : 0 }}
          >
            CampusEvents
          </Typography>

          {!isMobile && (
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
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
          )}

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/profile')}
              size={isMobile ? 'small' : 'medium'}
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
              size={isMobile ? 'small' : 'medium'}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section - Matching Home */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Stack alignItems="center" spacing={{ xs: 2, sm: 3 }}>
            <Avatar
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                bgcolor: getAvatarColor(),
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                border: '4px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              {getInitials()}
            </Avatar>

            <Box textAlign="center">
              <Typography
                variant={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'}
                component="h1"
                gutterBottom
                sx={{ fontWeight: 800 }}
              >
                {user.first_name} {user.last_name}
              </Typography>

              <Typography
                variant={isMobile ? 'body1' : 'h6'}
                paragraph
                sx={{ opacity: 0.9, mb: 2 }}
              >
                View your personal and academic information
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                <Chip
                  label={user.role}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}
                />
                <Chip
                  label={user.department}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Profile Details - Matching Home Card Style */}
      <Container sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>

          {/* Personal Information Card */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, flexGrow: 1 }}>
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  gutterBottom
                  sx={{ fontWeight: 'bold', mb: 3 }}
                >
                  Personal Information
                </Typography>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        bgcolor: '#f5f5f5',
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        First Name
                      </Typography>
                      <Typography
                        variant={isMobile ? 'body1' : 'h6'}
                        sx={{ fontWeight: 'bold', mt: 0.5 }}
                      >
                        {user.first_name}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        bgcolor: '#f5f5f5',
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        Last Name
                      </Typography>
                      <Typography
                        variant={isMobile ? 'body1' : 'h6'}
                        sx={{ fontWeight: 'bold', mt: 0.5 }}
                      >
                        {user.last_name}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        bgcolor: '#f5f5f5',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        textAlign: { xs: 'center', sm: 'left' },
                      }}
                    >
                      <Email sx={{ color: 'primary.main', fontSize: 28 }} />
                      <Box flex={1} sx={{ width: '100%' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                          }}
                        >
                          Email Address
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            mt: 0.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        bgcolor: '#f5f5f5',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        textAlign: { xs: 'center', sm: 'left' },
                      }}
                    >
                      <Phone sx={{ color: 'primary.main', fontSize: 28 }} />
                      <Box flex={1} sx={{ width: '100%' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                          }}
                        >
                          Phone Number
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            mt: 0.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          {user.phone_no || 'Not provided'}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>



                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Academic Information Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, flexGrow: 1 }}>
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  gutterBottom
                  sx={{ fontWeight: 'bold', mb: 3 }}
                >
                  Academic Info
                </Typography>

                <Stack spacing={{ xs: 2, sm: 3 }}>
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      mb={1}
                    >
                      <Badge sx={{ color: 'primary.main' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        Register Number
                      </Typography>
                    </Stack>
                    <Typography
                      variant={isMobile ? 'body1' : 'h6'}
                      sx={{
                        fontWeight: 'bold',
                        pl: { xs: 0, sm: 4 },
                        color: 'primary.main',
                      }}
                    >
                      {user.username}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      mb={1}
                    >
                      <School sx={{ color: 'primary.main' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        Department
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        pl: { xs: 0, sm: 4 },
                      }}
                    >
                      {user.department}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      mb={1}
                    >
                      <AccountCircle sx={{ color: 'primary.main' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        Role
                      </Typography>
                    </Stack>
                    <Chip
                      label={user.role}
                      sx={{
                        ml: { xs: 0, sm: 4 },
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons Card - Matching Home */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  gutterBottom
                  sx={{ fontWeight: 'bold', mb: 3 }}
                >
                  Account Actions
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                >

                  <Button
                    onClick={() => navigate('/ChangePassword')}
                    variant="contained"
                    color="primary"
                    size={isMobile ? 'medium' : 'large'}
                    fullWidth={isMobile}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 'bold',
                      bgcolor: 'primary.main',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    Update Password
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer - Matching Home */}
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

export default Profile;