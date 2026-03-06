import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  InputAdornment,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  PlayArrow as PlayArrowIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Bookmark as BookmarkIcon,
  PlaylistAdd as PlaylistAddIcon,
  Comment as CommentIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

// TypeScript interface for Video
interface Video {
  id: number;
  videoCode: string;
  depCode: string;
  courseCode: string;
  postedOwner: string;
  path: string;
  title?: string;
  description?: string;
}

/**
 * Video Component
 *
 * Main video player and library component.
 * Provides video playback, search, and navigation functionality.
 *
 * @returns {JSX.Element} The video component
 */
const Video: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Sample video data for demonstration (replace with actual API data)
  const sampleVideos: Video[] = [
    {
      id: 1,
      videoCode: 'VID001',
      depCode: 'CS101',
      courseCode: 'CS101',
      postedOwner: 'Dr. Smith',
      path: '/src/video/a.vdmpvf',
      title: 'Introduction to Programming',
      description: 'Basic concepts of programming',
    },
    {
      id: 2,
      videoCode: 'VID002',
      depCode: 'CS101',
      courseCode: 'CS101',
      postedOwner: 'Dr. Smith',
      path: '/src/video/b.vdmpvf',
      title: 'Variables and Data Types',
      description: 'Understanding variables and data types',
    },
    {
      id: 3,
      videoCode: 'VID003',
      depCode: 'CS101',
      courseCode: 'CS101',
      postedOwner: 'Dr. Smith',
      path: '/src/video/c.vdmpvf',
      title: 'Control Structures',
      description: 'If statements and loops',
    },
  ];

  /**
   * Fetches videos from the API
   */
  const fetchVideos = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      // For now, using sample data. Replace with actual API call:
      // const response = await apiService.getVideos();
      // setVideos(response.data);
      setVideos(sampleVideos);
      if (sampleVideos.length > 0) {
        setCurrentVideo(sampleVideos[0]);
      }
    } catch (err: any) {
      setError('Failed to load videos. Please try again.');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles video selection
   * @param {Video} video - Selected video object
   */
  const handleVideoSelect = (video: Video): void => {
    setCurrentVideo(video);
  };

  /**
   * Handles search functionality
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchTerm);
  };

  /**
   * Toggles navigation drawer
   */
  const toggleDrawer = (): void => {
    setDrawerOpen(!drawerOpen);
  };

  /**
   * Navigation menu items
   */
  const menuItems = [
    { label: 'Home', path: '/home' },
    { label: 'Courses', path: '/course' },
    { label: 'Departments', path: '/dep' },
    { label: 'Upload Video', path: '/postvideo' },
  ];

  /**
   * Handles navigation
   * @param {string} path - Navigation path
   */
  const handleNavigate = (path: string): void => {
    navigate(path);
    setDrawerOpen(false);
  };

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            EthioLecture Videos
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => handleNavigate(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" color="primary">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Main Video Player */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                {currentVideo ? (
                  <>
                    <Typography variant="h5" gutterBottom>
                      {currentVideo.title || 'Video Player'}
                    </Typography>
                    <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 2 }}>
                      <video
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                        controls
                        src={currentVideo.path}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Chip label={`Course: ${currentVideo.courseCode}`} sx={{ mr: 1 }} />
                      <Chip label={`Department: ${currentVideo.depCode}`} sx={{ mr: 1 }} />
                      <Chip label={`By: ${currentVideo.postedOwner}`} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {currentVideo.description || 'No description available.'}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h6" align="center">
                    No video selected
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Video Controls */}
            {currentVideo && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button variant="contained" color="primary" startIcon={<ThumbUpIcon />}>
                  Like
                </Button>
                <Button variant="outlined" startIcon={<ThumbDownIcon />}>
                  Dislike
                </Button>
                <Button variant="outlined" startIcon={<BookmarkIcon />}>
                  Save
                </Button>
                <Button variant="outlined" startIcon={<PlaylistAddIcon />}>
                  Add to Playlist
                </Button>
                <Button variant="outlined" startIcon={<CommentIcon />}>
                  Comments
                </Button>
              </Box>
            )}
          </Grid>

          {/* Video Library */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Video Library
            </Typography>
            <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
              {videos.map((video) => (
                <Card
                  key={video.id}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    border: currentVideo?.id === video.id ? 2 : 0,
                    borderColor: 'primary.main',
                  }}
                  onClick={() => handleVideoSelect(video)}
                >
                  <CardMedia
                    component="video"
                    height="140"
                    src={video.path}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="subtitle2" noWrap>
                      {video.title || `Video ${video.videoCode}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {video.courseCode} • {video.postedOwner}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Video;