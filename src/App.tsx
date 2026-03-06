

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import PostDepartment from './department/PostDepartment';
import Department from './department/Department';
import UpdateDep from './department/UpdateDep';
import Header from './department/Header';
import CourseList from './course/CourseList';
import UpdateCourse from './course/UpdateCourse';
import ViewSingleCourse from './course/ViewSingleCourse';
import HomePage from './header/HomePage';
import PostCourse from './course/PostCourse';
import PostVideo from './video/PostVideo';
import Video from './video/Video';
import Login from './Login/Login';
import CourseHeader from './course/CourseHeader';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Create Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

/**
 * Main Application Component
 *
 * Sets up routing, authentication, and Material UI theme provider
 * for the EthioLecture application.
 *
 * @returns {JSX.Element} The root application component
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="course-header" element={<ProtectedRoute><CourseHeader /></ProtectedRoute>} />
            <Route path="course" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
            <Route path="postcourse" element={<ProtectedRoute><PostCourse /></ProtectedRoute>} />
            <Route path="postdep" element={<ProtectedRoute><PostDepartment /></ProtectedRoute>} />
            <Route path="dep" element={<ProtectedRoute><Department /></ProtectedRoute>} />
            <Route path="postvideo" element={<ProtectedRoute><PostVideo /></ProtectedRoute>} />
            <Route path="video" element={<ProtectedRoute><Video /></ProtectedRoute>} />
            <Route path="/update/:depCode" element={<ProtectedRoute><UpdateDep /></ProtectedRoute>} />
            <Route path="/update-course/:courseCode" element={<ProtectedRoute><UpdateCourse /></ProtectedRoute>} />
            <Route path="/course-details/:courseCode" element={<ProtectedRoute><ViewSingleCourse /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;