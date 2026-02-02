import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Box, 
  Container,
  Card
} from '@mui/material';

const Landing = () => {
  const navigate = useNavigate();

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
          {/* Blue Header Section */}
          <Box 
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              py: 8,
              textAlign: 'center',
              px: 3
            }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.2rem', md: '2.8rem' }
              }}
            >
              CampusEvents
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 300,
                opacity: 0.9,
                letterSpacing: 0.5
              }}
            >
              Your Event Universe
            </Typography>
          </Box>

          {/* White Content Section */}
          <Box 
            sx={{ 
              bgcolor: 'white',
              py: 6,
              px: 3,
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                mb: 4,
                lineHeight: 1.6,
                fontSize: '1.05rem'
              }}
            >
              Discover, register, and organize events all in one place. From workshops to cultural fests, unleash the campus spirit.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 5,
                py: 1.5,
                borderRadius: 1
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Landing;

