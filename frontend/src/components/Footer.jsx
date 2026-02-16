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
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Footer = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Protect route + load user
    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            navigate('/login');
        } else {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    }, [navigate]);

    // Prevent render until user is loaded
    if (!user) return null;
    return (
        <div>
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
                            <Typography variant="body2">
                                Designed for students, by students.
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

                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#0f172a' }}>
                                Contact Us
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, maxWidth: 300 }}>
                                Email: campus.events12@gmail.com
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, maxWidth: 300 }}>
                                Phone: +91 92078 19010
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, maxWidth: 300 }}>
                                Address: ABC Street, Kochi, Kerala, India
                            </Typography>
                        </Grid>

                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#0f172a' }}>
                                Platform
                            </Typography>
                            <Stack spacing={1}>
                                {['About Us'].map((item) => (
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
                                {['Feedback'].map((item) => (
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
        </div>
    );
};

export default Footer;