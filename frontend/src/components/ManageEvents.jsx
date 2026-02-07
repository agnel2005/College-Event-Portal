  // src/components/ManageEvents.jsx

  import { Tabs, Tab, Snackbar, Alert } from '@mui/material';   // TAB VIEW and toasts
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
    const [tab, setTab] = useState('pending');

    // toast states
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');




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

    const res = await fetch(`http://localhost:8000/api/events/${id}/approve/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff_id: user.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      setToastMessage(data.error || 'Not authorized');
      setToastOpen(true);
      return;
    }

    fetchEvents();
  };


    // ❌ reject
    const rejectEvent = async (id) => {
    console.log(`🔴 Rejecting event ID: ${id}`);

    const res = await fetch(`http://localhost:8000/api/events/${id}/reject/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff_id: user.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      setToastMessage(data.error || 'Not authorized');
      setToastOpen(true);
      return;
    }

    fetchEvents();
  };



    // ⚪ reset to pending
  const resetToPending = async (event) => {
    // 🚫 department mismatch → toast immediately
    if (user.department !== event.created_by.department) {
      setToastMessage('You are not authorized to modify events from another department');
      setToastOpen(true);
      return;
    }

    // ✅ only SAME department sees confirmation
    if (!window.confirm('Reset this event to pending?')) return;

    const res = await fetch(`http://127.0.0.1:8000/api/events/${event.id}/reset/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff_id: user.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      setToastMessage(data.error || 'Not authorized');
      setToastOpen(true);
      return;
    }

    fetchEvents();
  };


    // 🗑 delete
    const deleteEvent = async (event) => {
    // 🚫 department mismatch → toast only
    if (user.department !== event.created_by.department) {
      setToastMessage('You are not authorized to delete events from another department');
      setToastOpen(true);
      setDeleteTarget(null);
      return;
    }

    // ✅ same department → confirm
    if (!window.confirm('Are you sure you want to permanently delete this event?')) return;

    const res = await fetch(
      `http://localhost:8000/api/events/${event.id}/delete/`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: user.id }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      setToastMessage(data.error || 'Not authorized');
      setToastOpen(true);
      return;
    }

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


    // tab structure code
    const filteredEvents = events.filter((event) => {
      if (tab === 'pending') return event.approval_status === 'pending';
      if (tab === 'approved') return event.approval_status === 'approved';
      if (tab === 'rejected') return event.approval_status === 'rejected';
      return true;
    });


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

              <Tabs
                value={tab}
                onChange={(e, newValue) => setTab(newValue)}
                sx={{ mb: 3 }}
              >
                <Tab label="Pending" value="pending" />
                <Tab label="Approved" value="approved" />
                <Tab label="Rejected" value="rejected" />
              </Tabs>


              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa' }}>
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell><strong>Requested By</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.category}</TableCell>

                      <TableCell>
                        <strong>
                          {event.created_by.first_name} {event.created_by.last_name}
                        </strong>
                        <br />
                        <small>
                          {event.created_by.username} ({event.created_by.department})
                        </small>
                      </TableCell>


                      <TableCell>{statusChip(event.approval_status)}</TableCell>

                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button size="small" variant="outlined" onClick={() => setViewEvent(event)}>
                            View 🛈︎
                          </Button>

                          <Button
                            size="small"
                            variant="contained"
                            disabled={event.approval_status === 'approved'}
                            onClick={() => approveEvent(event.id)}
                          >
                            Approve ✅
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={event.approval_status === 'rejected'}
                            onClick={() => rejectEvent(event.id)}
                          >
                            Reject 🚫
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            disabled={event.approval_status === 'pending'}
                            onClick={() => resetToPending(event)}

                          >
                            Pending ⏳
                          </Button>

                          <Button
                            size="small"
                            variant="text"
                            color="error"
                            onClick={() => deleteEvent(event)}

                          >
                            Delete 🗑️
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
                <Typography>
                  <strong>Requested By:</strong><br />
                  {viewEvent.created_by.first_name} {viewEvent.created_by.last_name}<br />
                  {viewEvent.created_by.username}<br />
                  {viewEvent.created_by.department}
                </Typography>

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
        <Snackbar
    open={toastOpen}
    autoHideDuration={4000}
    onClose={() => setToastOpen(false)}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert
      severity="error"
      onClose={() => setToastOpen(false)}
      sx={{ width: '100%' }}
    >
      {toastMessage}
    </Alert>
  </Snackbar>

      </Box>
    );
  };

  export default ManageEvents;
