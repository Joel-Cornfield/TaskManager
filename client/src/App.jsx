import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Board from './components/Board';
import { TaskProvider } from './context/TaskContext';
import './styles/app.css';
import Login from './pages/Login';
import Register from './pages/Register';
import useTasks from './hooks/useTasks';
import Workspaces from './pages/Workspaces';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <TaskProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Board /></ProtectedRoute>} />
          <Route path="/workspaces" element={<ProtectedRoute><Workspaces /></ProtectedRoute>} />
          <Route path="/workspace/:id" element={<ProtectedRoute><Board /></ProtectedRoute>} />
        </Routes>
      </Router>
    </TaskProvider>
  );
};

export default App;