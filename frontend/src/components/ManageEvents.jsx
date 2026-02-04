import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ManageEvents = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const [events, setEvents] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewEvent, setViewEvent] = useState(null);

  // 🔐 staff-only access
  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/login');
    }
  }, [user, navigate]);

  // 📥 fetch events
  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/events/');
      const data = await res.json();
      setEvents(data);
      console.log('📥 Events fetched:', data);
    } catch (err) {
      console.error('❌ Failed to fetch events', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ approve
  const approveEvent = async (id) => {
    console.log(`🟢 Approving event ID: ${id}`);
    await fetch(`http://localhost:8000/api/events/${id}/approve/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff_id: user.id }),
    });
    fetchEvents();
  };

  // ❌ reject
  const rejectEvent = async (id) => {
    console.log(`🔴 Rejecting event ID: ${id}`);
    await fetch(`http://localhost:8000/api/events/${id}/reject/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff_id: user.id }),
    });
    fetchEvents();
  };

  // ⚪ reset to pending
  const resetToPending = async (id) => {
    if (!window.confirm('Reset this event to pending?')) return;

    await fetch(`http://127.0.0.1:8000/api/events/${id}/reset/`, {
      method: 'PATCH',
    });

    fetchEvents();
  };

  // 🗑 delete
  const deleteEvent = async () => {
    if (!deleteTarget) return;

    await fetch(
      `http://localhost:8000/api/events/${deleteTarget}/delete/`,
      { method: 'DELETE' }
    );

    setDeleteTarget(null);
    fetchEvents();
  };

  const statusChip = (status) => {
    const color =
      status === 'approved'
        ? 'success'
        : status === 'rejected'
        ? 'error'
        : 'warning';

    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* NAVBAR */}
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }} elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/staff-dashboard')}
            >
              Back
            </Button>
            <Typography variant="h6" fontWeight="bold">
              Manage Event Requests
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* CONTENT */}
      <Container sx={{ mt: 5 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Student Event Requests
            </Typography>

            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.category}</TableCell>
                    <TableCell>{statusChip(event.approval_status)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" onClick={() => setViewEvent(event)}>
                          View
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          disabled={event.approval_status === 'approved'}
                          onClick={() => approveEvent(event.id)}
                        >
                          Approve
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={event.approval_status === 'rejected'}
                          onClick={() => rejectEvent(event.id)}
                        >
                          Reject
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          disabled={event.approval_status === 'pending'}
                          onClick={() => resetToPending(event.id)}
                        >
                          Pending
                        </Button>

                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          onClick={() => setDeleteTarget(event.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Container>

      {/* VIEW DETAILS */}
      <Dialog open={Boolean(viewEvent)} onClose={() => setViewEvent(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent dividers>
          {viewEvent && (
            <Stack spacing={2}>
              <Typography><strong>Title:</strong> {viewEvent.title}</Typography>
              <Typography><strong>Category:</strong> {viewEvent.category}</Typography>
              <Typography><strong>Status:</strong> {viewEvent.approval_status}</Typography>
              <Typography><strong>Date:</strong> {viewEvent.start_date} → {viewEvent.end_date}</Typography>
              <Typography><strong>Time:</strong> {viewEvent.start_time} → {viewEvent.end_time}</Typography>
              <Typography><strong>Venue:</strong> {viewEvent.venue}</Typography>
              <Typography><strong>Description:</strong><br />{viewEvent.description}</Typography>
              {viewEvent.poster_image && (
                <Box component="img" src={viewEvent.poster_image} sx={{ width: '100%', borderRadius: 2 }} />
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewEvent(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          Are you sure you want to permanently delete this event?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={deleteEvent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageEvents;
