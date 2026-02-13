import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, createUser, updateUser, deleteUser } from '../utils/userApi.js';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Edit as EditIcon,
  VpnKey as PasswordIcon,
  Visibility,
  VisibilityOff,
  Logout as LogoutIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNo: "",
    department: "",
    role: "student",
  });

  // Edit User Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    password: "",
  });

  // Load current user from localStorage and fetch all users
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch users when currentUser is set
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      loadUsers();
    }
  }, [currentUser]);

  // Load users from API
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers(currentUser.id);
      // Map backend data to frontend format
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.full_name || `${user.first_name} ${user.last_name}`,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        username: user.username,
        role: user.role,
        phoneNo: user.phone_no,
        department: user.department,
      }));
      setUsers(formattedUsers);
    } catch (err) {
      const errorMsg = err.error || 'Failed to load users';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Edit Dialog input change
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Add new user
  const handleAddUser = async () => {
    // Validation
    if (!newUser.firstName.trim() || !newUser.lastName.trim() || !newUser.email.trim() || !newUser.username.trim()) {
      toast.error("All fields are required");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if user already exists
    if (users.some(u => u.email === newUser.email)) {
      toast.error("Email already exists");
      return;
    }

    if (users.some(u => u.username === newUser.username)) {
      toast.error("Username already exists");
      return;
    }

    try {
      const userData = {
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        phone_no: newUser.phoneNo,
        department: newUser.department,
        role: newUser.role.toLowerCase(),
      };

      const response = await createUser(userData, currentUser.id);

      // Add new user to list
      const formattedNewUser = {
        id: response.id,
        name: response.full_name || `${response.first_name} ${response.last_name}`,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        username: response.username,
        role: response.role.toUpperCase(),
        phoneNo: response.phone_no,
        department: response.department,
      };

      setUsers([...users, formattedNewUser]);

      // Reset form
      setNewUser({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNo: "",
        department: "",
        role: "student",
      });

      toast.success("User created successfully");
    } catch (err) {
      const errorMsg = err.error || 'Failed to create user';
      toast.error(errorMsg);
    }
  };

  // Change role
  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUser(id, { role: newRole.toLowerCase() }, currentUser.id);

      // Update local state
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      toast.success("User role updated successfully");
    } catch (err) {
      const errorMsg = err.error || 'Failed to update user role';
      toast.error(errorMsg);
    }
  };

  // Open Edit Dialog
  const handleOpenEditDialog = (user) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      password: "", // Don't show current password
    });
    setEditDialogOpen(true);
  };

  // Close Edit Dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
    setShowPassword(false);
  };

  // Handle User Update (Username/Password)
  const handleUpdateUser = async () => {
    if (!editFormData.username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    try {
      const updateData = {
        username: editFormData.username,
      };

      if (editFormData.password.trim()) {
        updateData.password = editFormData.password;
      }

      await updateUser(editingUser.id, updateData, currentUser.id);

      // Update local state
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...u, username: editFormData.username } : u
      );
      setUsers(updatedUsers);
      toast.success("User updated successfully");
      handleCloseEditDialog();
    } catch (err) {
      const errorMsg = err.error || 'Failed to update user';
      toast.error(errorMsg);
    }
  };

  // Delete user (prevent deleting ADMIN)
  const handleDeleteUser = async (id) => {
    const userToDelete = users.find((user) => user.id === id);

    if (userToDelete.role.toUpperCase() === "ADMIN") {
      toast.error("Admin cannot be deleted!");
      return;
    }

    try {
      await deleteUser(id, currentUser.id);

      // Remove from local state
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      toast.success("User deleted successfully");
    } catch (err) {
      const errorMsg = err.error || 'Failed to delete user';
      toast.error(errorMsg);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="text.secondary">Loading users...</Typography>
          </Stack>
        </Box>
      </>
    );
  }

  return (
    <>

      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
        {/* Header Section */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 4 }}>
          <Container maxWidth="lg">
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <DashboardIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
                    Admin Dashboard
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Manage users, roles, and system access
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  fontWeight: 'bold',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Logout
              </Button>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Create User Section */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
                    <PersonAddIcon color="primary" /> Create New User
                  </Typography>
                  <Divider sx={{ mb: 4 }} />

                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={newUser.firstName}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={newUser.lastName}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={newUser.username}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNo"
                      value={newUser.phoneNo}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={newUser.department}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />

                    <FormControl fullWidth size="small">
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={newUser.role}
                        onChange={handleChange}
                        label="Role"
                      >
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddUser}
                      startIcon={<PersonAddIcon />}
                      sx={{
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem'
                      }}
                    >
                      Create Account
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Users Table Section */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    System Users <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'normal', ml: 1 }}>({users.length})</Box>
                  </Typography>
                </Box>

                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name / Info</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Current Role</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Change Role</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                            <Typography color="text.secondary">No users found in the system</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <BadgeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">{user.username}</Typography>
                                </Stack>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{user.department || '-'}</Typography>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: 'inline-flex',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 5,
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  bgcolor: user.role.toUpperCase() === 'ADMIN' ? 'error.light' : (user.role.toUpperCase() === 'STAFF' ? 'info.light' : 'success.light'),
                                  color: user.role.toUpperCase() === 'ADMIN' ? 'error.contrastText' : (user.role.toUpperCase() === 'STAFF' ? 'info.contrastText' : 'success.contrastText'),
                                }}
                              >
                                {user.role}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                  value={user.role.toLowerCase()}
                                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                  variant="outlined"
                                >
                                  <MenuItem value="student">Student</MenuItem>
                                  <MenuItem value="staff">Staff</MenuItem>
                                  <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="Edit User Credentials">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleOpenEditDialog(user)}
                                    sx={{
                                      bgcolor: 'primary.lighter',
                                      '&:hover': { bgcolor: 'primary.light', color: 'white' }
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={user.role.toUpperCase() === "ADMIN" ? "Admin cannot be deleted" : "Delete User"}>
                                  <span>
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDeleteUser(user.id)}
                                      disabled={user.role.toUpperCase() === "ADMIN"}
                                      sx={{
                                        bgcolor: 'error.lighter',
                                        '&:hover': { bgcolor: 'error.light', color: 'white' }
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon color="primary" /> Edit User Credentials
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Updating credentials for <strong>{editingUser?.name}</strong>
            </Typography>

            <TextField
              fullWidth
              label="Username"
              name="username"
              value={editFormData.username}
              onChange={handleEditChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <BadgeIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
              }}
            />

            <TextField
              fullWidth
              label="New Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={editFormData.password}
              onChange={handleEditChange}
              variant="outlined"
              size="small"
              placeholder="Leave blank to keep current"
              InputProps={{
                startAdornment: <PasswordIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button onClick={handleCloseEditDialog} color="inherit">Cancel</Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            sx={{ fontWeight: 'bold' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
