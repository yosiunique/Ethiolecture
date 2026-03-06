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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { apiService } from '../services/api';

// TypeScript interface for Department
interface Department {
  id: number;
  depCode: string;
  depTitle: string;
  faculty: string;
}

/**
 * UpdateDep Component
 *
 * Form component for updating existing departments.
 * Fetches department data by depCode and provides update functionality.
 *
 * @returns {JSX.Element} The department update form component
 */
const UpdateDep: React.FC = () => {
  const navigate = useNavigate();
  const { depCode } = useParams<{ depCode: string }>();
  const [formData, setFormData] = useState({
    id: '',
    depCode: '',
    depTitle: '',
    faculty: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  /**
   * Fetches department data for the given depCode
   */
  const fetchDepartment = async (): Promise<void> => {
    if (!depCode) return;

    try {
      setFetchLoading(true);
      // For now, using mock data. Replace with actual API call:
      // const response = await apiService.getDepartmentByCode(depCode);
      // const department: Department = response.data;

      // Mock data for demonstration
      const mockDepartment: Department = {
        id: 1,
        depCode: depCode,
        depTitle: 'Computer Science Department',
        faculty: 'Faculty of Science and Technology',
      };

      setFormData({
        id: mockDepartment.id.toString(),
        depCode: mockDepartment.depCode,
        depTitle: mockDepartment.depTitle,
        faculty: mockDepartment.faculty,
      });
    } catch (err: any) {
      setError('Failed to load department data. Please try again.');
      console.error('Error fetching department:', err);
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
    if (!formData.depTitle.trim()) {
      setError('Department title is required');
      return false;
    }
    if (!formData.faculty.trim()) {
      setError('Faculty is required');
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
        depCode: formData.depCode,
        depTitle: formData.depTitle,
        faculty: formData.faculty,
      };

      await apiService.updateDepartment(parseInt(formData.id), updateData);
      setSuccess('Department updated successfully!');
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/dep');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update department. Please try again.');
      console.error('Error updating department:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles cancel action - navigates back to department list
   */
  const handleCancel = (): void => {
    navigate('/dep');
  };

  // Fetch department data on component mount
  useEffect(() => {
    fetchDepartment();
  }, [depCode]);

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Header />
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
              Update Department
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
                id="depCode"
                label="Department Code"
                name="depCode"
                value={formData.depCode}
                disabled
                helperText="Department code cannot be changed"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="depTitle"
                label="Department Title"
                name="depTitle"
                value={formData.depTitle}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="faculty"
                label="Faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                disabled={loading}
              />

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
                    'Update Department'
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

export default UpdateDep;