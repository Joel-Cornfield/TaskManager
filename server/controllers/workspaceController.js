import pool from '../config/db.js';

export const getWorkspaces = async (req, res, next) => {
    try {
        const workspaces = await pool.query('SELECT * FROM workspaces WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(workspaces.rows);
    } catch (error) {
        next(error);
    }
};

export const createWorkspace = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400);
            return newError('Name required');
        }
        const newWorkspace = await pool.query('INSERT INTO workspaces (name, user_id) VALUES ($1, $2) RETURNING *', [name, req.user.id]);
        res.status(201).json(newWorkspace.rows[0]);
    } catch (error) {
        next(error);
    }
}