import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { state } = useTasks();
  const { token } = state;

  // Direct users to login page if not authenticated 
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Render protected component if authenticated
  return children; 
};

export default ProtectedRoute;
