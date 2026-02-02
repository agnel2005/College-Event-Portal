// frontend/src/components/Login.jsx


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login/',
        {
          username: username,
          password: password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const user = response.data.user;

      // store user (temporary, JWT later)
      localStorage.setItem('user', JSON.stringify(user));

      alert('✅ Login successful');

      // role-based redirect
      if (user.role === 'staff') {
        navigate('/staff-dashboard');
      } else {
        navigate('/home');
      }

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('❌ Invalid username or password');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* Navigation Bar */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}
          >
            CampusEvents
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Login Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="sm">
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
              Welcome Back
            </Typography>

            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Sign in to your CampusEvents account
            </Typography>
          </Box>

          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              
              <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <TextField
                  fullWidth
                  label="Register Number / Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ fontWeight: 'bold', py: 1.5, mt: 2 }}
                >
                  Sign In
                </Button>

                <Typography align="center">
                  Don&apos;t have an account?{' '}
                  <span
                    style={{
                      color: '#1976d2',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/signup')}
                  >
                    Sign up here
                  </span>
                </Typography>
              </Box>

            </CardContent>
          </Card>

        </Container>
      </Box>
    </Box>
  );
};

export default Login;
