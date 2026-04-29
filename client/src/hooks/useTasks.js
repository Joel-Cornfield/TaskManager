import { useCallback } from 'react';
import { useTasks as useTasksContext } from '../context/TaskContext';
import {
    getTasks,
    createTask as apiCreateTask,
    updateTask as apiUpdateTask,
    deleteTask as apiDeleteTask,
    getWorkspaces,
    createWorkspace as apiCreateWorkspace,
    login as apiLogin,
    register as apiRegister,
    updateWorkspace as apiUpdateWorkspace,
    deleteWorkspace as apiDeleteWorkspace,
    getUser,
    getWorkspaceMembers,
    addWorkspaceMember as apiAddWorkspaceMember,
    removeWorkspaceMember as apiRemoveWorkspaceMember,
    uploadProfileImage as apiUploadProfileImage,
} from '../api/tasksApi.js';

// Custom hook that wraps the raw context and API calls into clean, reusable functions.
// Components import this instead of touching the context or API directly.
const useTasks = () => {
    const { state, dispatch } = useTasksContext();

    // useCallback keeps the function reference stable between renders.
    // Without it, a new function is created every render, which can trigger
    // infinite loops when these functions are used in useEffect dependency arrays.

    const login = useCallback(async (email, password) => {
        dispatch({ type: 'SET_LOADING_AUTH', payload: true });
        try {
            const { token, user } = await apiLogin(email, password);
            dispatch({ type: 'SET_TOKEN', payload: token });
            dispatch({ type: 'SET_USER', payload: user });
            return { token, user };
        } catch (error) {
            console.error('Error logging in user', error);
        } finally {
            dispatch({ type: 'SET_LOADING_AUTH', payload: false });
        }
    }, [dispatch]);

    const register = useCallback(async (email, password, name) => {
        // No state update needed here
        dispatch({ type: 'SET_LOADING_AUTH', payload: true });
        try {
            const data = await apiRegister(email, password, name);
            return data;
        } catch (error) {
            console.error('Error registering user', error)
        } finally {
            dispatch({ type: 'SET_LOADING_AUTH', payload: false });
        }
    }, [dispatch]);

    const fetchTasks = useCallback(async (workspaceId) => {
        if (!workspaceId) return;
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await getTasks(workspaceId);
            dispatch({ type: 'SET_TASKS', payload: response }); // Replace the tasks array in state
        } catch (error) {
            console.error('Error fetching tasks', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [dispatch]);

    const createTask = useCallback(async (task) => {
        try {
            const response = await apiCreateTask(task);
            dispatch({ type: 'ADD_TASK', payload: response }); // Append it to the tasks array in state
        } catch (error) {
            console.error('Error creating task', error);
        }
    }, [dispatch]);

    const updateTask = useCallback(async (id, task) => {
        try {
            const response = await apiUpdateTask(id, task);
            dispatch({ type: 'UPDATE_TASK', payload: response }); // Replace it in the tasks array in state
        } catch (error) {
            console.error('Error updating task', error);
        }
    }, [dispatch]);

    const deleteTask = useCallback(async (id) => {
        try {
            await apiDeleteTask(id);
            dispatch({ type: 'DELETE_TASK', payload: id }); // Remove it from state
        } catch (error) {
            console.error('Error deleting task', error);
        }
    }, [dispatch]);

    const fetchWorkspaces = useCallback(async () => {
        dispatch({ type: 'SET_LOADING_WORKSPACES', payload: true });
        try {
            const response = await getWorkspaces();
            dispatch({ type: 'SET_WORKSPACES', payload: response }); // Store them in state
        } catch (error) {
            console.error('Error getting workspaces', error);
        } finally {
            dispatch({ type: 'SET_LOADING_WORKSPACES', payload: false });
        }
    }, [dispatch]);

    const createWorkspace = useCallback(async (name) => {
        try {
            const response = await apiCreateWorkspace(name);
            dispatch({ type: 'ADD_WORKSPACE', payload: response }); // Appends it to the workspaces array in state
            return response;
        } catch (error) {
            console.error('Error creating workspace', error);
        }
    }, [dispatch]);

    const updateWorkspace = useCallback(async (id, name) => {
        try {
            const response = await apiUpdateWorkspace(id, name);
            dispatch({ type: 'UPDATE_WORKSPACE', payload: response }); // Replace it in workspaces array in state 
            return response;
        } catch (error) {
            console.error('Error updating workspace', error);
        }
    }, [dispatch]);

    const deleteWorkspace = useCallback(async (id) => {
        try {
            await apiDeleteWorkspace(id);
            dispatch({ type: 'DELETE_WORKSPACE', payload: id }); // Remove it from state
        } catch (error) {
            console.error('Error deleting workspace', error);
        }
    }, [dispatch]);

    const fetchWorkspaceMembers = useCallback(async (workspaceId) => {
        try {
            const response = await getWorkspaceMembers(workspaceId);
            return response;
        } catch (error) {
            console.error('Error fetching workspace members', error);
            return [];
        }
    }, []);

    const addWorkspaceMember = useCallback(async (workspaceId, email) => {
        try {
            const response = await apiAddWorkspaceMember(workspaceId, email);
            return response;
        } catch (error) {
            console.error('Error adding workspace member', error);
            throw error;
        }
    }, []);

    const removeWorkspaceMember = useCallback(async (workspaceId, memberId) => {
        try {
            await apiRemoveWorkspaceMember(workspaceId, memberId);
        } catch (error) {
            console.error('Error removing workspace member', error);
            throw error;
        }
    }, []);

    const uploadProfileImage = useCallback(async (formData) => {
        try {
            const response = await apiUploadProfileImage(formData);
            return response;
        } catch (error) {
            console.error('Error uploading profile image', error);
            throw error;
        }
    }, []);

    // Sets the active workspace in state and immediately fetches its tasks.
    const setCurrentWorkspace = useCallback((workspace) => {
        dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspace });
        if (workspace?.id) {
            fetchTasks(workspace.id);
        }
    }, [dispatch, fetchTasks]);

    // Expose state values and functions to any component that calls useTasks().
    return {
        tasks: state.tasks || [],
        workspaces: state.workspaces || [],
        memberWorkspaces: state.memberWorkspaces || [],
        currentWorkspace: state.currentWorkspace || null,
        user: state.user,
        token: state.token,
        loading: state.loading,
        loadingWorkspaces: state.loadingWorkspaces,
        loadingAuth: state.loadingAuth,
        login,
        register,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        fetchWorkspaces,
        createWorkspace,
        updateWorkspace, 
        deleteWorkspace,
        fetchWorkspaceMembers,
        addWorkspaceMember,
        removeWorkspaceMember,
        setCurrentWorkspace,
        uploadProfileImage,
        dispatch,
    };
};

export default useTasks;