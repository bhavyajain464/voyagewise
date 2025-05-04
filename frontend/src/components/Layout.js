import React, { useEffect } from 'react';
import { AppBar, Box, Container, CssBaseline, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, FlightTakeoff as FlightIcon, AccountCircle as AccountIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import PageBackground from './common/PageBackground';

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get background image based on current route
  const getBackgroundImage = () => {
    if (location.pathname.startsWith('/trips/')) {
      return '/images/trip-detail-bg.jpg';
    } else if (location.pathname.startsWith('/admin')) {
      return '/images/admin-bg.jpg';
    }
    return '/images/trip-list-bg.jpg';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'My Trips', icon: <FlightIcon />, path: '/trips' },
    { text: 'Profile', icon: <AccountIcon />, path: '/profile' },
  ];

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    // Clear session storage
    sessionStorage.clear();
    // Clear browser history
    window.history.pushState(null, '', '/login');
    // Force a hard navigation to login page
    window.location.href = '/login';
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <PageBackground imageUrl={getBackgroundImage()}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: 'rgba(25, 118, 210, 0.95)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              VoyageWise
            </Typography>
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Toolbar />
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  toggleDrawer();
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'rgba(25, 118, 210, 0.9)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    color: 'rgba(0, 0, 0, 0.87)',
                    '& .MuiTypography-root': {
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: '100%',
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          <Container 
            maxWidth="lg"
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.95)',
              },
              '& .MuiTable-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              },
              '& .MuiTableCell-root': {
                color: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>
    </PageBackground>
  );
};

export default Layout; 