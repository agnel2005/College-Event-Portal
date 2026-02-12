import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
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

const MyEvents = () => {
  const navigate = useNavigate();

  // 🔐 get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // 🗂️ state to store only THIS student's events
  const [myEvents, setMyEvents] = useState([]);

  // 🗑️ store event ID that student wants to cancel
  const [cancelTarget, setCancelTarget] = useState(null);

  // 🔐 protect route (only students allowed)
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  // 📥 fetch ALL events, then filter student's own events
  const fetchMyEvents = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/events/');
      const data = await res.json();

      // 🧠 filter only events created by this user
      const filtered = data.filter(
        (event) =>
          event.created_by &&
          event.created_by.username === user.username
      );

      setMyEvents(filtered);
    } catch (err) {
      console.error('❌ Failed to fetch events', err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // 🟥 cancel (delete) event — ONLY for pending events
  const cancelEvent = async () => {
    if (!cancelTarget) return;

    try {
      await fetch(
        `http://127.0.0.1:8000/api/events/${cancelTarget}/cancel/`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id }),
        }
      );

      setCancelTarget(null);
      fetchMyEvents(); // refresh list after delete
    } catch (err) {
      console.error('❌ Failed to cancel event', err);
    }
  };

  // 🎨 status chip helper
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      {/* 🔝 NAVBAR */}
      <Navbar />

      {/* 📋 CONTENT */}
      <Container sx={{ mt: 5, flexGrow: 1 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Events Requested By Me
            </Typography>

            {myEvents.length === 0 ? (
              <Typography color="text.secondary">
                You haven’t requested any events yet.
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa' }}>
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Approved By</strong></TableCell>
                    <TableCell align="right"><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>


                <TableBody>
                  {myEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.category}</TableCell>
                      <TableCell>
                        {statusChip(event.approval_status)}
                        {event.remark && (
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                            "{event.remark}"
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        {event.approval_status === 'approved' && event.approved_by ? (
                          <>
                            {event.approved_by.first_name} {event.approved_by.last_name}
                            <br />
                            <small>({event.approved_by.department})</small>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>




                      <TableCell align="right">
                        {event.approval_status === 'pending' ? (
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => setCancelTarget(event.id)}
                          >
                            Cancel Request
                          </Button>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Already processed
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* 🗑️ CANCEL CONFIRMATION DIALOG */}
      <Dialog
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
      >
        <DialogTitle>Cancel Event Request</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel this event request?
          <br />
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelTarget(null)}>No</Button>
          <Button color="error" variant="contained" onClick={cancelEvent}>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* Footer */}
      <Box sx={{ bgcolor: '#222', color: 'grey.500', py: 6, mt: 8 }}>
        <Container align="center">
          <Typography variant="body1">
            © 2026 CampusEvents Management Portal
          </Typography>
          <Typography variant="body2">
            Designed for students, by students.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MyEvents;
