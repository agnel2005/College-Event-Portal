import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowBack, VpnKey, School, AccountCircle, Email, Person, Badge } from '@mui/icons-material';

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

const StaffProfile = () => {
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
            const parsedUser = JSON.parse(storedUser);
            // Extra check for staff role
            if (parsedUser.role !== 'staff') {
                navigate('/login');
            }
            setUser(parsedUser);
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

            {/* Navigation Bar - Simple Back Button for Staff */}
            <AppBar position="sticky" color="default" elevation={1}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            startIcon={<ArrowBack />}
                            color="inherit"
                            onClick={() => navigate('/staff-dashboard')}
                        >
                            Back to Dashboard
                        </Button>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', color: 'primary.main' }}
                        >
                            Staff Profile
                        </Typography>
                    </Stack>

                    <Button
                        variant="contained"
                        color="error" // Red for logout
                        onClick={() => {
                            localStorage.removeItem('user');
                            navigate('/login');
                        }}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
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
                                Staff Member - {user.department}
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
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Profile Details */}
            <Container sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>

                    {/* Personal Information Card */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ height: '100%', borderRadius: 3 }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                                <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    Personal Information
                                </Typography>

                                <Grid container spacing={{ xs: 2, sm: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>FIRST NAME</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user.first_name}</Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>LAST NAME</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user.last_name}</Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Email color="primary" />
                                            <Box>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>EMAIL ADDRESS</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.email}</Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Phone color="primary" />
                                            <Box>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>PHONE NUMBER</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.phone_no || 'Not provided'}</Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Staff Information Card */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', borderRadius: 3 }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                                <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    Staff Details
                                </Typography>

                                <Stack spacing={3}>
                                    <Box>
                                        <Stack direction="row" spacing={1} mb={1}>
                                            <VpnKey color="primary" />
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>STAFF CODE</Typography>
                                        </Stack>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', pl: 4, color: 'primary.main' }}>
                                            {user.staff_code || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Stack direction="row" spacing={1} mb={1}>
                                            <School color="primary" />
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>DEPARTMENT</Typography>
                                        </Stack>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', pl: 4 }}>
                                            {user.department}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Stack direction="row" spacing={1} mb={1}>
                                            <AccountCircle color="primary" />
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>USERNAME</Typography>
                                        </Stack>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', pl: 4 }}>
                                            {user.username}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Account Actions
                                </Typography>
                                <Button
                                    onClick={() => navigate('/ChangePassword')}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth={isMobile}
                                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                >
                                    Update Password
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            </Container>

            {/* Footer */}
            <Box sx={{ bgcolor: '#222', color: 'grey.500', py: 6, mt: 8, textAlign: 'center' }}>
                <Typography variant="body1">© 2026 CampusEvents Management Portal</Typography>
            </Box>

        </Box>
    );
};

export default StaffProfile;
