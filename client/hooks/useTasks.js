import { useContext, useEffect } from "react";
import { useTasks as useTasksContext } from '../context/TaskContext';
import tasksApi from '../api/tasksApi.js';

const useTasks = () => {
    const { state, dispatch } = useTasksContext();

    const fetchTasks = async () => {
        try {
            const response = await tasksApi.getTasks();
            dispatch({ type: 'SET_TASKS', payload: response.data });
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    const createTasks = async (task) => {
        try {
            const response = await tasksApi.createTask(task);
            dispatch({ type: 'ADD_TASK', payload: response.data });
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    const updateTask = async (id, task) => {
        try {
            const response = await tasksApi.updateTask(id, task);
            dispatch({ type: 'UPDATE_TASK', payload: response.data });
        } catch (error) {
            console.error('Error updating task, error');
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await tasksApi.deleteTask(id);
            dispatch({ type: 'DELETE_TASK', payload: id });
        } catch (error) {
            console.error('Error deleting task, error');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return { tasks: state.tasks, createTasks, updateTask, deleteTask };
};

export default useTasks;