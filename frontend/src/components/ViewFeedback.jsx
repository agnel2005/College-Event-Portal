import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Rating,
    Button,
    Stack,
    Chip,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const ViewFeedback = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'staff') {
            navigate('/login');
            return;
        }
        setUser(parsedUser);

        fetchFeedback(parsedUser.id);
    }, [navigate]);

    const fetchFeedback = async (staffId) => {
        try {
            // In a real app, you might want pagination or filtering
            const response = await axios.get(`http://127.0.0.1:8000/api/feedback/list/?staff_id=${staffId}`);
            setFeedbacks(response.data);
        } catch (error) {
            console.error("Failed to fetch feedback", error);
        }
    };

    if (!user) return null;

    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>

            {/* Navbar */}
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
                            Student Feedback
                        </Typography>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>

                    {feedbacks.length === 0 ? (
                        <Box p={4} textAlign="center">
                            <Typography variant="h6" color="text.secondary">No feedback submitted yet.</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ maxHeight: '80vh' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e0e0e0' }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e0e0e0' }}>Student</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e0e0e0' }}>Rating</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e0e0e0' }}>Message</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {feedbacks.map((fb) => (
                                        <TableRow key={fb.id} hover>
                                            <TableCell>
                                                {new Date(fb.created_at).toLocaleDateString()}
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    {new Date(fb.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={fb.user} size="small" color="primary" variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Rating value={fb.rating} readOnly size="small" />
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 400 }}>
                                                <Typography variant="body2">{fb.message}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default ViewFeedback;
