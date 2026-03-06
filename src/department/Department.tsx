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
  Add as AddIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
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
 * Department Component
 *
 * Displays a list of academic departments with CRUD operations.
 * Provides functionality to view, update, and delete departments.
 *
 * @returns {JSX.Element} The department list component
 */
const Department: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  /**
   * Fetches departments from the API
   */
  const fetchDepartments = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getDepartments();
      setDepartments(response.data);
    } catch (err: any) {
      setError('Failed to load departments. Please try again.');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles department deletion with confirmation
   * @param {number} id - Department ID to delete
   */
  const handleDeleteDepartment = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await apiService.deleteDepartment(id);
        // Remove from local state instead of reloading
        setDepartments(departments.filter(dep => dep.id !== id));
      } catch (err: any) {
        setError('Failed to delete department. Please try again.');
        console.error('Error deleting department:', err);
      }
    }
  };

  /**
   * Handles navigation to update department page
   * @param {string} depCode - Department code for updating
   */
  const handleUpdateDepartment = (depCode: string): void => {
    navigate(`/update/${depCode}`);
  };

  /**
   * Handles navigation to add new department page
   */
  const handleAddDepartment = (): void => {
    navigate('/postdep');
  };

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
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
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Departments
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddDepartment}
          >
            Add Department
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
                <TableCell>Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Faculty</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id} hover>
                    <TableCell>{department.id}</TableCell>
                    <TableCell>{department.depCode}</TableCell>
                    <TableCell>{department.depTitle}</TableCell>
                    <TableCell>{department.faculty}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleUpdateDepartment(department.depCode)}
                        title="Edit Department"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteDepartment(department.id)}
                        title="Delete Department"
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
        onClick={handleAddDepartment}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Department;
