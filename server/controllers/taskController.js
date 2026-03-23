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
        const { title, due_date } = req.body;
        if (!title) {
            res.status(400);
            return new Error('Title is required');
        }
        const newTask = await pool.query('INSERT INTO tasks (user_id, title, due_date) VALUES ($1, $2, $3) RETURNING *', [req.user.id, title, due_date]);
        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        next(error); 
    }
}

// Update task
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, completed, due_date } = req.body;

    const result = await pool.query(`UPDATE tasks SET title = $1, completed = $2, due_date = $3 WHERE id = $4 AND user_id = $5 RETURNING *`,
      [title, completed, due_date, id, req.user.id]
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