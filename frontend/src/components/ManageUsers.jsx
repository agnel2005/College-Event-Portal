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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ManageUsers = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const [students, setStudents] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 🔐 staff-only access
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

  // 🗑 delete student
  const deleteStudent = async (student) => {
    // 🚫 department mismatch → toast only
    if (user.department !== student.department) {
      setToastMessage('You are not authorized to delete students from another department');
      setToastOpen(true);
      return;
    }

    // ✅ same department → confirm
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
              Manage Students
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* CONTENT */}
      <Container sx={{ mt: 5 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Student Accounts
            </Typography>

            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Department</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.username}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.department}</TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => deleteStudent(student)}
                      >
                        Delete 🗑️
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Container>

      {/* TOAST */}
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

export default ManageUsers;
