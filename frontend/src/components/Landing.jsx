import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  Grid,
  Card,
  CardContent,
  IconButton,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Event,
  Groups,
  HistoryEdu,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  ArrowForward,
} from '@mui/icons-material';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '50vh', display: 'flex', flexDirection: 'column' }}>
      {/* Glassmorphism Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(5px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                letterSpacing: '-0.5px'
              }}
              onClick={() => navigate('/')}
            >
              CampusEvents
            </Typography>

            {!isMobile && (
              <Stack direction="row" spacing={4}>
                {['Home', 'Features', 'About', 'Contact'].map((item) => (
                  <Button
                    key={item}
                    color="inherit"
                    onClick={() => scrollToSection(item.toLowerCase())}
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            )}

            <Stack direction="row" spacing={2}>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 'bold', textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={() => navigate('/signup')}
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '50px',
                  px: 3,
                  background: 'linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)',
                  boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
                  '&:hover': {
                    boxShadow: '0 6px 20px 0 rgba(25, 118, 210, 0.23)',
                  }
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #23355eff 100%)',
          pt: 12,
          pb: 16,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background elements */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.39), rgba(25, 118, 210, 0))',
          zIndex: 0,
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: 50,
          right: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0), rgba(25, 118, 210, 0.39))',
          zIndex: 0,
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ mb: 2, display: 'inline-block', px: 2, py: 0.5, bgcolor: 'rgba(25, 118, 210, 0.1)', borderRadius: 10 }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
              The #1 Event Platform for Students
            </Typography>
          </Box>

          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              lineHeight: 1.2,
              color: '#f8fafc'
            }}
          >
            Discover & Organize <br />
            <Box component="span" sx={{ color: '#1976d2' }}>External Events</Box> Effortlessly
          </Typography>

          <Typography variant="h6" color="#f8fafc" paragraph sx={{ mb: 6, maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
            Join thousands of students and faculty in the most vibrant campus community.
            Register for hackathons, workshops, and cultural fests with just one click.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              endIcon={<ArrowForward />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 50,
                textTransform: 'none',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
              }}
            >
              Get Started Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => scrollToSection('features')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 50,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
              }}
            >
              Explore Features
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container id="features" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: '#0f172a' }}>
            Why Choose CampusEvents?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Everything you need to manage your campus life, all in one simplified platform.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', justifyContent: 'center' }}>
          {[
            {
              icon: <Event sx={{ fontSize: 40, color: 'white' }} />,
              title: "Discover Events",
              desc: "Stay updated with the latest workshops, seminars, and fests happening around you.",
              color: '#3b82f6'
            },
            {
              icon: <Groups sx={{ fontSize: 40, color: 'white' }} />,
              title: "Connect & Collaborate",
              desc: "Form teams, meet like-minded peers, and grow your professional network on campus.",
              color: '#10b981'
            },
            {
              icon: <HistoryEdu sx={{ fontSize: 40, color: 'white' }} />,
              title: "Seamless Management",
              desc: "Organizers can track registrations, manage attendees, and gather feedback effortlessly.",
              color: '#8b5cf6'
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  bgcolor: '#e4eff9ff',
                  border: 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid #0f172a'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      bgcolor: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: `0 10px 15px -3px ${feature.color}40`
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#0f172a' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>


      {/* Stats/About Section */}
      <Box id="about" sx={{ bgcolor: '#0f172a', color: 'white', py: 10 }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Empowering Student Communities
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, mb: 4, lineHeight: 1.6 }}>
                We believe that the best learning happens outside the classroom. Our mission is to connect every student with opportunities to learn, lead, and grow.
              </Typography>
              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="primary.light">50+</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>Active Events</Typography>
                </Box>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="primary.light">2k+</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>Students Registered</Typography>
                </Box>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="primary.light">100%</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>Free to Use</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students collaborating"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>


      {/* Footer */}
      <Box id="contact" sx={{ bgcolor: '#f8fafc', pt: 10, pb: 6, borderTop: '1px solid #e2e8f0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                fontWeight={800}
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CampusEvents
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
                Making campus life more vibrant, connected, and organized for everyone.
              </Typography>
              <Stack direction="row" spacing={1}>
                {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, i) => (
                  <IconButton key={i} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                    <Icon />
                  </IconButton>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#0f172a' }}>
                Platform
              </Typography>
              <Stack spacing={1}>
                {['Browse Events', 'Organize', 'Communities', 'Success Stories'].map((item) => (
                  <Link key={item} href="#" underline="none" color="text.secondary" sx={{ fontSize: '0.9rem', transition: 'all 0.2s ease', '&:hover': { color: 'primary.main', transform: 'scale(1.02)' } }}>
                    {item}
                  </Link>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#0f172a' }}>
                Support
              </Typography>
              <Stack spacing={1}>
                {['Help Center', 'Safety Center', 'Community Guidelines', 'Contact Us'].map((item) => (
                  <Link key={item} href="#" underline="none" color="text.secondary" sx={{ fontSize: '0.9rem', transition: 'all 0.2s ease', '&:hover': { color: 'primary.main', transform: 'scale(1.02)' } }}>
                    {item}
                  </Link>
                ))}
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ borderTop: '1px solid #e2e8f0', mt: 8, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} CampusEvents Inc. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
