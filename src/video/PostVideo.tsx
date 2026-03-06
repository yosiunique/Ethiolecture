import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

// TypeScript interfaces
interface Course {
  id: number;
  courseCode: string;
  courseTittle: string;
  catagory: string;
}

interface Department {
  id: number;
  depCode: string;
  depTitle: string;
  faculty: string;
}

/**
 * PostVideo Component
 *
 * Form component for uploading new videos.
 * Provides input validation and API integration for video creation.
 *
 * @returns {JSX.Element} The video upload form component
 */
const PostVideo: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    videoCode: '',
    depCode: '',
    courseCode: '',
    postedOwner: '',
    path: '',
    title: '',
    description: '',
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  /**
   * Fetches courses and departments for dropdowns
   */
  const fetchData = async (): Promise<void> => {
    try {
      setFetchLoading(true);
      const [coursesResponse, departmentsResponse] = await Promise.all([
        apiService.getCourses(),
        apiService.getDepartments(),
      ]);
      setCourses(coursesResponse.data);
      setDepartments(departmentsResponse.data);
    } catch (err: any) {
      setError('Failed to load form data. Please refresh the page.');
      console.error('Error fetching data:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  /**
   * Handles input field changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  /**
   * Validates form data before submission
   * @returns {boolean} True if form is valid
   */
  const validateForm = (): boolean => {
    if (!formData.videoCode.trim()) {
      setError('Video code is required');
      return false;
    }
    if (!formData.depCode.trim()) {
      setError('Department selection is required');
      return false;
    }
    if (!formData.courseCode.trim()) {
      setError('Course selection is required');
      return false;
    }
    if (!formData.postedOwner.trim()) {
      setError('Video owner is required');
      return false;
    }
    if (!formData.path.trim()) {
      setError('Video path is required');
      return false;
    }
    return true;
  };

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.uploadVideo(formData);
      setSuccess('Video uploaded successfully!');
      // Clear form
      setFormData({
        videoCode: '',
        depCode: '',
        courseCode: '',
        postedOwner: '',
        path: '',
        title: '',
        description: '',
      });
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/video');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload video. Please try again.');
      console.error('Error uploading video:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles cancel action - navigates back to video list
   */
  const handleCancel = (): void => {
    navigate('/video');
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Upload New Video
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="videoCode"
                  label="Video Code"
                  name="videoCode"
                  value={formData.videoCode}
                  onChange={handleInputChange}
                  disabled={loading}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="postedOwner"
                  label="Video Owner"
                  name="postedOwner"
                  value={formData.postedOwner}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="depCode"
                  label="Department"
                  name="depCode"
                  select
                  value={formData.depCode}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Select Department</em>
                  </MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.depCode}>
                      {dept.depTitle} ({dept.depCode})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="courseCode"
                  label="Course"
                  name="courseCode"
                  select
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Select Course</em>
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.courseCode}>
                      {course.courseTittle} ({course.courseCode})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="title"
                  label="Video Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="path"
                  label="Video File Path"
                  name="path"
                  value={formData.path}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="/path/to/video.mp4"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Optional video description..."
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ flex: 1 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Uploading...
                  </>
                ) : (
                  'Upload Video'
                )}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                disabled={loading}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PostVideo;