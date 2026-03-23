import pool from "../config/db.js";

// Get tasks (for logged in user)
export const getTasks = async (req, res) => {
    try {
        const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [req.user.id]);
        res.json(tasks.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Create task
export const createTask = async (req, res) => {
    const { title } = req.body
    try {
        const newTask = await pool.query('INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *', [req.user.id, title]);
        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Update task
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, status } = req.body;

    try {
        const updatedTask = await pool.query('UPDATE tasks SET title = $1, status = $2 WHERE id = $3 AND user_id = $4 RETURNING *', [title, status, id, req.user.id]);
        res.json(updatedTask.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Delete task
export const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}