import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
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
 * ViewSingleCourse Component
 *
 * Displays detailed information for a single course.
 * Provides options to edit or delete the course.
 *
 * @returns {JSX.Element} The course detail view component
 */
const ViewSingleCourse: React.FC = () => {
  const navigate = useNavigate();
  const { courseCode } = useParams<{ courseCode: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  /**
   * Fetches course data for the given courseCode
   */
  const fetchCourse = async (): Promise<void> => {
    if (!courseCode) return;

    try {
      setLoading(true);
      setError('');
      // For now, using mock data. Replace with actual API call:
      // const response = await apiService.getCourseByCode(courseCode);
      // setCourse(response.data);

      // Mock data for demonstration
      const mockCourse: Course = {
        id: 1,
        courseCode: courseCode,
        courseTittle: 'Advanced Web Development',
        catagory: 'Computer Science',
      };

      setCourse(mockCourse);
    } catch (err: any) {
      setError('Failed to load course details. Please try again.');
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles course deletion with confirmation
   */
  const handleDeleteCourse = async (): Promise<void> => {
    if (!course) return;

    if (window.confirm(`Are you sure you want to delete the course "${course.courseTittle}"?`)) {
      try {
        await apiService.deleteCourse(course.id);
        navigate('/course');
      } catch (err: any) {
        setError('Failed to delete course. Please try again.');
        console.error('Error deleting course:', err);
      }
    }
  };

  /**
   * Handles navigation to edit course page
   */
  const handleEditCourse = (): void => {
    if (course) {
      navigate(`/update-course/${course.courseCode}`);
    }
  };

  /**
   * Handles navigation back to course list
   */
  const handleBackToList = (): void => {
    navigate('/course');
  };

  // Fetch course data on component mount
  useEffect(() => {
    fetchCourse();
  }, [courseCode]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Course not found. <Button onClick={handleBackToList}>Back to Courses</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      <CourseHeader />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToList}
            sx={{ mr: 2 }}
          >
            Back to Courses
          </Button>
          <Typography variant="h4" component="h1">
            Course Details
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              {course.courseTittle}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Course Code
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {course.courseCode}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Category
                  </Typography>
                  <Chip
                    label={course.catagory}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Course ID
                  </Typography>
                  <Typography variant="body1">
                    {course.id}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label="Active"
                    color="success"
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditCourse}
              >
                Edit Course
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteCourse}
              >
                Delete Course
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ViewSingleCourse;
