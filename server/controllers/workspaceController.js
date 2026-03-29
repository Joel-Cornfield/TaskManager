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
};

export const updateWorkspace = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        if (!name) {
            res.status(400);
            return newError('Name required');
        }
        const result = await pool.query('UPDATE workspaces SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',[name, id, req.user.id]);
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const deleteWorkspace = async (req, res, next) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM workspaces WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        res.json({ message: 'Workspace deleted' });
    } catch (error) {
        next(error)
    }
}