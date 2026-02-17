// frontend/src/components/Login.jsx


import React, { useState, useEffect } from 'react';
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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-hot-toast';


const Login = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'staff') {
        navigate('/staff-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [navigate]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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


      toast.success(' Login successful');

      // role-based redirect

      if (user.role === 'staff') {
        navigate('/staff-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/home');
      }

    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(' Invalid username or password');
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
          background: 'linear-gradient(135deg, #0f172a 0%, #23355eff 100%)',
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
                  label="Register Number"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
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
