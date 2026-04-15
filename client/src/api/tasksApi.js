import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data; // { token, user }
};

export const register = async (email, password, name) => {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password, name });
    return response.data;
};

export const getUser = async () => {
    const response = await axios.get(`${API_URL}/auth/me`, getAuthHeader());
    return response.data;
}

// Get all tasks 
export const getTasks = async (workspace_id) => {
    const response = await axios.get(`${API_URL}/tasks?workspaceId=${workspace_id}`, getAuthHeader());
    return response.data;
};

// Create a new task
export const createTask = async (task) => {
    const response = await axios.post(`${API_URL}/tasks`, task, getAuthHeader());
    return response.data;
};

// Update a task
export const updateTask = async (id, task) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, task, getAuthHeader());
    return response.data;
};

// Delete a task
export const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeader());
};

// Get workspaces
export const getWorkspaces = async () => {
    const response = await axios.get(`${API_URL}/workspaces`, getAuthHeader());
    return response.data;
};

// Create workspace
export const createWorkspace = async (name) => {
    const response = await axios.post(`${API_URL}/workspaces`, { name }, getAuthHeader());
    return response.data;
};

// Update workspace
export const updateWorkspace = async (id, name) => {
    const response = await axios.put(`${API_URL}/workspaces/${id}`, { name }, getAuthHeader());
    return response.data;
};

// Delete workspace
export const deleteWorkspace = async (id) => {
    await axios.delete(`${API_URL}/workspaces/${id}`, getAuthHeader());
};