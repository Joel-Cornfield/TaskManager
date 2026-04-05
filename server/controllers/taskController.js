import pool from "../config/db.js";

// Get tasks (for logged in user)
export const getTasks = async (req, res, next) => {
    try {
        const { workspaceId } = req.query;
        const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1 AND workspace_id = $2', [req.user.id, workspaceId]);
        res.json(tasks.rows);
    } catch (error) {
        next(error); // pass to middleware
    }
}

// Create task
export const createTask = async (req, res, next) => {
    try {
        const { title, due_date, workspace_id, status } = req.body;
        if (!title) {
            res.status(400);
            throw new Error('Title is required');
        }
        const newTask = await pool.query('INSERT INTO tasks (user_id, title, due_date, workspace_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [req.user.id, title, due_date || null, workspace_id, status || 'active']);
        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        next(error); 
    }
}

// Update task
export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, due_date, status } = req.body;
        
        // Fetch existing task so we can fall back to old values
        const existing = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (!existing.rows.length) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const current = existing.rows[0];

        // Use provided value if it exists, otherwise keep old value
        const updatedTitle = title ?? current.title;
        const updatedDueDate = due_date ?? current.due_date;
        const updatedStatus = status ?? current.status;

        const result = await pool.query(`UPDATE tasks SET title = $1, due_date = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *`,
          [updatedTitle, updatedDueDate, updatedStatus, id, req.user.id]
        );  
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

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