import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Board from './components/Board';
import WorkspaceList from './components/WorkspaceList';
import { TaskProvider } from './context/TaskContext';
import './styles/app.css';

const App = () => {
  return (
    <TaskProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/workspaces" element={<WorkspaceList />} />
          <Route path="/workspace/:id" element={<Board />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
};

export default App;