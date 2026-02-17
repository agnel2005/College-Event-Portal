import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Prevent render until user is loaded
  if (!user) return null;

  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Organize Events', path: '/addevent' },
    { label: 'Find Events', path: '/findevents' },
    { label: 'My Events', path: '/myevents' },
    { label: 'Feedback', path: '/feedback' },
    { label: 'About Us', path: '/aboutus' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', pt: 2 }}>
      <Stack direction="row" justifyContent="flex-end" sx={{ pr: 2, mb: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
        CampusEvents
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/profile')} sx={{ textAlign: 'center' }}>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center', color: 'error.main' }}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {/* Navigation Bar */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => navigate('/home')}
            >
              CampusEvents
            </Typography>

            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <>
                <Stack direction="row" spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      color="inherit"
                      onClick={() => navigate(item.path)}
                      sx={{ textTransform: 'none', fontSize: '1rem' }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Stack>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="nav">
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </div>
  );
};

export default Navbar;