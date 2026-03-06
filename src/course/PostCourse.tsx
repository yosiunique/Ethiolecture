import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CourseHeader from './CourseHeader';
import { apiService } from '../services/api';

/**
 * PostCourse Component
 *
 * Form component for creating new courses.
 * Provides input validation and API integration for course creation.
 *
 * @returns {JSX.Element} The course creation form component
 */
const PostCourse: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseCode: '',
    courseTittle: '',
    catagory: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Course categories
  const categories = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Business',
    'Arts',
    'Other',
  ];

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
    if (!formData.courseCode.trim()) {
      setError('Course code is required');
      return false;
    }
    if (!formData.courseTittle.trim()) {
      setError('Course title is required');
      return false;
    }
    if (!formData.catagory.trim()) {
      setError('Category is required');
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
      await apiService.createCourse(formData);
      setSuccess('Course created successfully!');
      // Clear form
      setFormData({
        courseCode: '',
        courseTittle: '',
        catagory: '',
      });
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/course');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create course. Please try again.');
      console.error('Error creating course:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles cancel action - navigates back to course list
   */
  const handleCancel = (): void => {
    navigate('/course');
  };

  return (
    <Box>
      <CourseHeader />
      <Container component="main" maxWidth="sm">
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
              Add New Course
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
              <TextField
                margin="normal"
                required
                fullWidth
                id="courseCode"
                label="Course Code"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                disabled={loading}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="courseTittle"
                label="Course Title"
                name="courseTittle"
                value={formData.courseTittle}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="catagory"
                label="Category"
                name="catagory"
                select
                value={formData.catagory}
                onChange={handleInputChange}
                disabled={loading}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>

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
                      Creating...
                    </>
                  ) : (
                    'Create Course'
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
    </Box>
  );
};

export default PostCourse;
