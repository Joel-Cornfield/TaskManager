import { useTasks as useTasksContext } from '../context/TaskContext';
import { getTasks, createTask, updateTask, deleteTask, getWorkspaces, createWorkspace } from '../api/tasksApi.js';

const useTasks = () => {
    const { state, dispatch } = useTasksContext();

    const fetchTasks = async (workspaceId) => {
        if (!workspaceId) return;
        try {
            const response = await getTasks(workspaceId);
            dispatch({ type: 'SET_TASKS', payload: response });
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    const createTasks = async (task) => {
        try {
            const response = await createTask(task);
            dispatch({ type: 'ADD_TASK', payload: response });
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    const updateTask = async (id, task) => {
        try {
            const response = await updateTask(id, task);
            dispatch({ type: 'UPDATE_TASK', payload: response });
        } catch (error) {
            console.error('Error updating task', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await deleteTask(id);
            dispatch({ type: 'DELETE_TASK', payload: id });
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const fetchWorkspaces = async () => {
        try {
            const response = await getWorkspaces();
            dispatch({ type: 'SET_WORKSPACES', payload: response })
        } catch (error) {
            console.error('Error getting workspaces', error)
        }
    };

    const createWorkspace = async (name) => {
        try {
            const response = await createWorkspace(name);
            dispatch({ type: 'ADD_WORKSPACE', payload: response});
        } catch (error) {
            console.error('Error creating workspace', error);
        }
    };

    const setCurrentWorkspace = (workspace) => {
        dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspace })
        fetchTasks(workspace.id);
    }

    return { tasks: state.tasks, workspaces: state.workspaces, currentWorkspace: state.currentWorkspace, user: state.user, token: state.token, createTasks, updateTask, deleteTask, fetchWorkspaces, createWorkspace, setCurrentWorkspace, dispatch, };
};

export default useTasks;