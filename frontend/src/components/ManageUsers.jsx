// src/components/ManageUsers.jsx

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
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ManageUsers = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // view events state
  const [viewStudent, setViewStudent] = useState(null);
  const [studentEvents, setStudentEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 🔐 staff-only
  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/login');
    }
  }, [user, navigate]);

  // 📥 fetch students
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/users/');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('❌ Failed to fetch students', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 📥 fetch specific student events
  const handleViewEvents = async (student) => {
    setViewStudent(student);
    setLoadingEvents(true);
    setStudentEvents([]);

    try {
      // fetch ALL events then filter (since backend doesn't have a specific filter endpoint yet)
      const res = await fetch('http://localhost:8000/api/events/');
      const allEvents = await res.json();

      // Filter events created by this student
      // Note: Backend serializer 'created_by' returns an object with 'username'
      const filtered = allEvents.filter(
        (event) => event.created_by.username === student.username
      );

      setStudentEvents(filtered);
    } catch (err) {
      console.error('❌ Failed to fetch events', err);
      setToastMessage('Failed to load student events');
      setToastOpen(true);
    } finally {
      setLoadingEvents(false);
    }
  };

  // 🗑 delete student (UNCHANGED logic)
  const deleteStudent = async (student) => {
    if (user.department !== student.department) {
      setToastMessage('You are not authorized to delete students from another department');
      setToastOpen(true);
      return;
    }

    if (!window.confirm(`Delete student ${student.username}?`)) return;

    const res = await fetch(
      `http://localhost:8000/api/users/${student.id}/delete/`,
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

    fetchStudents();
  };

  // 🧠 derived department list
  const knownDepartments = [
    'BCA',
    'BBA',
    'BCOM',
    'BSW',
    'BACE',
    'ECONOMICS',
    'PHYSICS',
    'MATHS',
    'MCA',
    'MCOM',
    'MSW',
    'MCMS',
    'MMH',
    'MBA'
  ];

  const departments = ['all', ...new Set([...knownDepartments, ...students.map(s => s.department)])];

  // 🔍 filtering logic
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();

    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesDept =
      departmentFilter === 'all' || student.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* NAVBAR */}
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }} elevation={1}>
        <Toolbar>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/staff-dashboard')}
            >
              Back
            </Button>
            <Typography variant="h6" fontWeight="bold">
              Manage Students
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 5 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Student Accounts
            </Typography>

            {/* SEARCH + FILTER */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <TextField
                label="Search by student name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
              />

              <TextField
                select
                label="Filter by department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell><strong>Student Name</strong></TableCell>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Department</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>{student.username}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewEvents(student)}
                        >
                          View Events 📅
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => deleteStudent(student)}
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

      {/* EVENTS DIALOG */}
      <Dialog
        open={Boolean(viewStudent)}
        onClose={() => setViewStudent(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Events Requested by {viewStudent?.first_name} {viewStudent?.last_name}
        </DialogTitle>
        <DialogContent dividers>
          {loadingEvents ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : studentEvents.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No event requests found for this student.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Event Title</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.start_date}</TableCell>
                    <TableCell>{event.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={event.approval_status}
                        color={getStatusColor(event.approval_status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewStudent(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* TOAST */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setToastOpen(false)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUsers;
