import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import {
  School,
  VideoLibrary,
  Business,
  Dashboard,
} from '@mui/icons-material';
import HomeHeader from './HomeHeader';

/**
 * HomePage Component
 *
 * Main dashboard page displaying navigation cards for different
 * sections of the EthioLecture application.
 *
 * @returns {JSX.Element} The home page component
 */
const HomePage: React.FC = () => {
  // Navigation cards data
  const navigationCards = [
    {
      title: 'Departments',
      description: 'Manage academic departments',
      icon: <Business color="primary" sx={{ fontSize: 40 }} />,
      path: '/dep',
    },
    {
      title: 'Courses',
      description: 'Browse and manage courses',
      icon: <School color="primary" sx={{ fontSize: 40 }} />,
      path: '/course',
    },
    {
      title: 'Videos',
      description: 'Access educational videos',
      icon: <VideoLibrary color="primary" sx={{ fontSize: 40 }} />,
      path: '/video',
    },
    {
      title: 'Dashboard',
      description: 'View system analytics',
      icon: <Dashboard color="primary" sx={{ fontSize: 40 }} />,
      path: '/dashboard',
    },
  ];

  /**
   * Handles navigation to different sections
   * @param {string} path - The route path to navigate to
   */
  const handleNavigate = (path: string): void => {
    window.location.href = path; // Temporary navigation, should use useNavigate hook
  };

  return (
    <Box>
      <HomeHeader />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to EthioLecture
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Your comprehensive educational platform
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
          }}
        >
          {navigationCards.map((card, index) => (
            <Box
              key={index}
              sx={{
                flex: '1 1 300px',
                maxWidth: '300px',
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    fullWidth
                    onClick={() => handleNavigate(card.path)}
                  >
                    Explore
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;