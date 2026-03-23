import React, { createContext, useContext, useReducer } from 'react';

const TaskContext = createContext();

const initialState = {
    tasks: [],
};

const taskReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS': // Replace task array with new data
            return { ...state, tasks: action.payload };
        case 'ADD_TASK': // Append new task to array
            return { ...state, tasks: [...state.tasks, action.payload] };
        case 'UPDATE_TASK': // Update task matching an id
            return { 
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.id ? action.payload : task
                ),
            };
        case 'DELETE_TASK': // Delete a task matching an id
            return { 
                ...state, 
                tasks: state.tasks.filter(task => task.id !== action.payload),
            };
    }
};

export const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, initialState);
    
    // Provides state (current tasks) and dispatch (function to trigger actions) 
    return (
        <TaskContext.Provider value = {{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
};

// Custom hook returning context value (allows components to access and update tasks)
export const useTasks = () => {
    return useContext(TaskContext);
}