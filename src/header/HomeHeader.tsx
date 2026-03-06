import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School,
  ExitToApp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * HomeHeader Component
 *
 * Navigation header with responsive menu and logout functionality.
 * Provides navigation links to main application sections.
 *
 * @returns {JSX.Element} The application header component
 */
const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  /**
   * Handles menu open for mobile navigation
   * @param {React.MouseEvent} event - Click event
   */
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles menu close
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles navigation to different routes
   * @param {string} path - Route path to navigate to
   */
  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  /**
   * Handles user logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation menu items
  const menuItems = [
    { label: 'Home', path: '/home' },
    { label: 'Courses', path: '/course' },
    { label: 'Videos', path: '/video' },
    { label: 'Departments', path: '/dep' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <School sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          EthioLecture
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => handleNavigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
          <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />}>
            Logout
          </Button>
        </Box>

        {/* Mobile Navigation */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {menuItems.map((item) => (
              <MenuItem key={item.path} onClick={() => handleNavigate(item.path)}>
                {item.label}
              </MenuItem>
            ))}
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HomeHeader;