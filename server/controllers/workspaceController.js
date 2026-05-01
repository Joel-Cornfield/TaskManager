import pool from '../config/db.js';

const isWorkspaceOwner = async (workspaceId, userId) => {
    const check = await pool.query(
        `SELECT 1 
        FROM workspace_members
        WHERE workspace_id = $1 
            AND user_id = $2
            AND role = 'owner'`,
        [workspaceId, userId]
    );
    return check.rows.length > 0;
};

const isWorkspaceMember = async (workspaceId, userId) => {
    const check = await pool.query(
        `SELECT 1 
        FROM workspace_members
        WHERE workspace_id = $1 
            AND user_id = $2`,
        [workspaceId, userId]
    );
    return check.rows.length > 0;
};


export const getWorkspaces = async (req, res, next) => {
    try {
        // Get owned workspaces
        const ownedWorkspaces = await pool.query(
            `SELECT w.*, 'owner' as user_role
            FROM workspaces w
            JOIN workspace_members m
                ON w.id = m.workspace_id
            WHERE m.user_id = $1 AND m.role = 'owner'
            ORDER BY w.created_at DESC`,
            [req.user.id]
        );

        // Get member workspaces (not owned)
        const memberWorkspaces = await pool.query(
            `SELECT w.*, 'member' as user_role
            FROM workspaces w
            JOIN workspace_members m
                ON w.id = m.workspace_id
            WHERE m.user_id = $1 AND m.role != 'owner'
            ORDER BY w.created_at DESC`,
            [req.user.id]
        );

        res.json({
            owned: ownedWorkspaces.rows,
            member: memberWorkspaces.rows
        });
    } catch (error) {
        next(error);
    }
};

export const createWorkspace = async (req, res, next) => {
    // Get a dedicated client connection from the pool
    // Needed so all queries run on the SAME connection (required for transactions)
    const client = await pool.connect();
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400);
            return newError('Name required');
        }

        // Start transaction (all queries temporary until commit)
        await client.query('BEGIN');

        const newWorkspace = await client.query('INSERT INTO workspaces (name, user_id) VALUES ($1, $2) RETURNING *', [name, req.user.id]);
        
        await client.query(`INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, 'owner')`, [newWorkspace.id, req.user.id]);

        // If both queries succeed -> commit changes
        await client.query('COMMIT');
        res.status(201).json(newWorkspace.rows[0]);
    } catch (error) {
        // If ANY query fails → undo all changes made in this transaction
        await client.query('ROLLBACK');
        next(error);
    } finally {
        // Always release the client back to the pool (prevents connection leaks)
        client.release();
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

        if (!(await isWorkspaceOwner(id, req.user.id))) {
            return res.status(403).json({ message: "Only the workspace owner can update this workspace" });
        }
        const result = await pool.query('UPDATE workspaces SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',[name, id, req.user.id]);

        if (!result.rows.length) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const deleteWorkspace = async (req, res, next) => {
    const { id } = req.params;

    if (!(await isWorkspaceOwner(id, req.user.id))) {
        return res.status(404).json({ message: "Only the workspace owner can delete this workspace" });
    }
    try {
        await pool.query('DELETE FROM workspaces WHERE id = $1', [id]);
        res.json({ message: 'Workspace deleted' });
    } catch (error) {
        next(error)
    }
};

export const getWorkspaceMembers = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!(await isWorkspaceMember(id, req.user.id))) {
            return res.status(403).json({ message: "Not a member of this workspace" });
        }

        const members = await pool.query(
            `SELECT u.id, u.email, u.name, u.profile_image, m.role, m.joined_at
            FROM workspace_members m 
            JOIN users u
                ON u.id = m.user_id
            WHERE m.workspace_id = $1
            ORDER BY m.joined_at ASC`,
            [id]
        );
        res.json(members.rows);
    } catch (error) {
        next(error);
    }
};

export const addWorkspaceMember = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!email) {
            res.status(400);
            throw new Error('Member email required');
        }

        if (!(await isWorkspaceOwner(id, req.user.id))) {
            return res.status(403).json({ message: "Only the workspace owner can add members" });
        }

        const userResult = await pool.query('SELECT id, email, name FROM users WHERE email = $1', [email]);
        if (!userResult.rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const userToAdd = userResult.rows[0];

        const existing = await pool.query(
            `SELECT 1 FROM workspace_members
            WHERE workspace_id = $1
                AND user_id = $2`,
            [id, userToAdd.id]
        );
        if (existing.rows.length) {
            return res.status(400).json({ message: "User is already a member" });
        }

        await pool.query(
            `INSERT INTO workspace_members (workspace_id, user_id, role) 
            VALUES ($1, $2, 'member')`,
            [id, userToAdd.id]
        );

        res.status(201).json({ id: userToAdd.id, email: userToAdd.email, name: userToAdd.name, role: 'member' });
    } catch (error) {
        next(error);
    }
};

export const removeWorkspaceMember = async (req, res, next) => {
    try {
        const { id, memberId } = req.params;

        if (!(await isWorkspaceOwner(id, req.user.id))) {
            return res.status(403).json({ message: 'Only workspace owners can remove members' });
        }

        if (parseInt(memberId, 10) === req.user.id) {
            return res.status(400).json({ message: 'Owners cannot remove themselves' });
        }

        await pool.query(
            `DELETE FROM workspace_members
            WHERE workspace_id = $1
                AND user_id = $2`,
            [id, memberId]
        );

        res.json({ message: "Member removed" });
    } catch (error) {
        next(error);
    }
}