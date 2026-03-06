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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CourseHeader from './CourseHeader';
import { apiService } from '../services/api';

// TypeScript interface for Course
interface Course {
  id: number;
  courseCode: string;
  courseTittle: string;
  catagory: string;
}

/**
 * UpdateCourse Component
 *
 * Form component for updating existing courses.
 * Fetches course data by courseCode and provides update functionality.
 *
 * @returns {JSX.Element} The course update form component
 */
const UpdateCourse: React.FC = () => {
  const navigate = useNavigate();
  const { courseCode } = useParams<{ courseCode: string }>();
  const [formData, setFormData] = useState({
    id: '',
    courseCode: '',
    courseTittle: '',
    catagory: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
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
   * Fetches course data for the given courseCode
   */
  const fetchCourse = async (): Promise<void> => {
    if (!courseCode) return;

    try {
      setFetchLoading(true);
      // For now, using a placeholder. Replace with actual API call:
      // const response = await apiService.getCourseByCode(courseCode);
      // const course: Course = response.data;

      // Mock data for demonstration
      const mockCourse: Course = {
        id: 1,
        courseCode: courseCode,
        courseTittle: 'Sample Course Title',
        catagory: 'Computer Science',
      };

      setFormData({
        id: mockCourse.id.toString(),
        courseCode: mockCourse.courseCode,
        courseTittle: mockCourse.courseTittle,
        catagory: mockCourse.catagory,
      });
    } catch (err: any) {
      setError('Failed to load course data. Please try again.');
      console.error('Error fetching course:', err);
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
      const updateData = {
        id: parseInt(formData.id),
        courseCode: formData.courseCode,
        courseTittle: formData.courseTittle,
        catagory: formData.catagory,
      };

      await apiService.updateCourse(parseInt(formData.id), updateData);
      setSuccess('Course updated successfully!');
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/course');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update course. Please try again.');
      console.error('Error updating course:', err);
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

  // Fetch course data on component mount
  useEffect(() => {
    fetchCourse();
  }, [courseCode]);

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

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
              Update Course
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
                fullWidth
                id="courseCode"
                label="Course Code"
                name="courseCode"
                value={formData.courseCode}
                disabled
                helperText="Course code cannot be changed"
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
                      Updating...
                    </>
                  ) : (
                    'Update Course'
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

export default UpdateCourse;