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
  Stack,
  Alert,
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff, LockReset } from '@mui/icons-material';

import { validatePassword } from '../utils/validators';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If user is not loaded yet, don't render or render loading
  if (!user) return null;

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }


    try {
      const response = await axios.post('http://127.0.0.1:8000/api/change-password/', {
        username: user.username,
        old_password: formData.oldPassword,
        new_password: formData.newPassword,
      });

      setSuccess('✅ Password changed successfully! Logging out...');

      // Clear user and redirect to login
      setTimeout(() => {
        localStorage.removeItem('user');
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Failed to change password');
    }
  };

  const isMobile = window.innerWidth < 600;

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>

      {/* Navigation Bar */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            color="primary"
            onClick={() => navigate('/profile')}
            sx={{ mr: 2 }}
          >
            Back to Profile
          </Button>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}
          >
            CampusEvents
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box textAlign="center" mb={4}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={1}>
            <LockReset color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" fontWeight="bold">Change Password</Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Update your account password securely
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>

                {/* Old Password */}
                <TextField
                  fullWidth
                  label="Current Password"
                  name="oldPassword"
                  type={showPassword.old ? 'text' : 'password'}
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleTogglePassword('old')}>
                          {showPassword.old ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* New Password */}
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  helperText="Must be at least 6 characters long"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleTogglePassword('new')}>
                          {showPassword.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Confirm Password */}
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleTogglePassword('confirm')}>
                          {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!!success}
                  sx={{
                    mt: 2,
                    fontWeight: 'bold',
                    py: 1.5,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  Update Password
                </Button>

              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ChangePassword;