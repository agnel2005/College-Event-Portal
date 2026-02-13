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
  Stack,
  Button
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const Insights = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/login');
    }
  }, [user, navigate]);

  const [stats, setStats] = React.useState({
    totalStudents: 0,
    totalRequests: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/insights/?staff_id=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch insights", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* NAVBAR */}
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }} elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/staff-dashboard')}
            >
              Back
            </Button>
            <Typography variant="h6" fontWeight="bold">
              Insights
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {Object.entries(stats).map(([key, value]) => (
            <Grid item xs={12} md={3} key={key}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </Typography>
                  <Typography variant="h4">{value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Insights;
