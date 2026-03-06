import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
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
 * CourseList Component
 *
 * Displays a list of courses with CRUD operations.
 * Provides functionality to view, update, and delete courses.
 *
 * @returns {JSX.Element} The course list component
 */
const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  /**
   * Fetches courses from the API
   */
  const fetchCourses = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getCourses();
      setCourses(response.data);
    } catch (err: any) {
      setError('Failed to load courses. Please try again.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles course deletion with confirmation
   * @param {number} id - Course ID to delete
   */
  const handleDeleteCourse = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await apiService.deleteCourse(id);
        // Remove from local state instead of reloading
        setCourses(courses.filter(course => course.id !== id));
      } catch (err: any) {
        setError('Failed to delete course. Please try again.');
        console.error('Error deleting course:', err);
      }
    }
  };

  /**
   * Handles navigation to update course page
   * @param {string} courseCode - Course code for updating
   */
  const handleUpdateCourse = (courseCode: string): void => {
    navigate(`/update-course/${courseCode}`);
  };

  /**
   * Handles navigation to view course details
   * @param {string} courseCode - Course code for viewing details
   */
  const handleViewCourse = (courseCode: string): void => {
    navigate(`/course-details/${courseCode}`);
  };

  /**
   * Handles navigation to add new course page
   */
  const handleAddCourse = (): void => {
    navigate('/postcourse');
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <CourseHeader />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Courses
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddCourse}
          >
            Add Course
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Course Code</TableCell>
                <TableCell>Course Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>{course.id}</TableCell>
                    <TableCell>{course.courseCode}</TableCell>
                    <TableCell>{course.courseTittle}</TableCell>
                    <TableCell>{course.catagory}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="info"
                        onClick={() => handleViewCourse(course.courseCode)}
                        title="View Course Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleUpdateCourse(course.courseCode)}
                        title="Edit Course"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCourse(course.id)}
                        title="Delete Course"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16, display: { xs: 'flex', md: 'none' } }}
        onClick={handleAddCourse}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default CourseList;
