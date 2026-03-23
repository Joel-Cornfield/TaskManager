import pool from "../config/db.js";

// Get tasks (for logged in user)
export const getTasks = async (req, res, next) => {
    try {
        const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [req.user.id]);
        res.json(tasks.rows);
    } catch (error) {
        next(error); // pass to middleware
    }
}

// Create task
export const createTask = async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title) {
            res.status(400);
            return new Error('Title is required');
        }
        const newTask = await pool.query('INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *', [req.user.id, title]);
        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        next(error); 
    }
}

// Update task
export const updateTask = async (req, res, next) => {
    const { id } = req.params;
    try {
        const { title, status } = req.body;
        if (!title || !status) {
            res.status(400);
            return new Error('Title and status is required');
        }
        const updatedTask = await pool.query('UPDATE tasks SET title = $1, status = $2 WHERE id = $3 AND user_id = $4 RETURNING *', [title, status, id, req.user.id]);
        res.json(updatedTask.rows[0]);
    } catch (error) {
        next(error);
    }
}

// Delete task
export const deleteTask = async (req, res, next) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
}