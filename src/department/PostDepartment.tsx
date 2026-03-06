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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { apiService } from '../services/api';

/**
 * PostDepartment Component
 *
 * Form component for creating new academic departments.
 * Provides input validation and API integration for department creation.
 *
 * @returns {JSX.Element} The department creation form component
 */
const PostDepartment: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    depCode: '',
    depTitle: '',
    faculty: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

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
    if (!formData.depCode.trim()) {
      setError('Department code is required');
      return false;
    }
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
      await apiService.createDepartment(formData);
      setSuccess('Department created successfully!');
      // Clear form
      setFormData({
        depCode: '',
        depTitle: '',
        faculty: '',
      });
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/dep');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create department. Please try again.');
      console.error('Error creating department:', err);
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
              Add New Department
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
                id="depCode"
                label="Department Code"
                name="depCode"
                value={formData.depCode}
                onChange={handleInputChange}
                disabled={loading}
                autoFocus
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
                      Creating...
                    </>
                  ) : (
                    'Create Department'
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

export default PostDepartment;