import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './compoments/Navbar';
import Board from './compoments/Board';
import TaskForm from './compoments/TaskForm';
import { TaskProvider } from './context/TaskContext';
import './styles/app.css';

const App = () => {
  return (
    <TaskProvider>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Board />}/>
                <Route path="/new-task" element={<TaskForm />}/>
            </Routes>
        </Router>
    </TaskProvider>
  );
};

export default App;