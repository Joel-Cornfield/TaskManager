import pool from "../config/db.js";

const isWorkspaceMember = async (workspaceId, userId) => {
    const check = await pool.query(
        `SELECT 1 
        FROM workspace_members 
        WHERE workspace_id = $1
            AND user_id = $2
        `,
        [workspaceId, userId]
    );
    return check.rows.length > 0;
};

// Get tasks (for logged in user)
export const getTasks = async (req, res, next) => {
    try {
        const { workspaceId } = req.query;
        if (!workspaceId) {
            return res.status(400).json({ message: 'workspaceId query parameter required' });
        }

        if (!(await isWorkspaceMember(workspaceId, req.user.id))) {
            return res.status(403).json({ message: "Not a member of this workspace" });
        }
        
        const tasks = await pool.query(
            `SELECT t.*, 
                    array_agg(ta.user_id) FILTER (WHERE ta.user_id IS NOT NULL) as assignee_ids,
                    array_agg(u.name) FILTER (WHERE u.name IS NOT NULL) as assignee_names
             FROM tasks t
             LEFT JOIN task_assignees ta ON t.id = ta.task_id
             LEFT JOIN users u ON ta.user_id = u.id
             WHERE t.workspace_id = $1
             GROUP BY t.id
             ORDER BY t.created_at DESC`,
            [workspaceId]
        );
        res.json(tasks.rows);
    } catch (error) {
        next(error); // pass to middleware
    }
}

// Create task
export const createTask = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { title, due_date, workspace_id, status, assignee_ids } = req.body;
        if (!title) {
            res.status(400);
            throw new Error('Title is required');
        }
        if (!workspace_id) {
            res.status(400);
            throw new Error('Workspace ID is required');
        }
        if (!(await isWorkspaceMember(workspace_id, req.user.id))) {
            return res.status(403).json({ message: "Not a member of this workspace" });
        }

        // Validate assignee_ids are workspace members
        if (assignee_ids && assignee_ids.length > 0) {
            for (const assigneeId of assignee_ids) {
                if (!(await isWorkspaceMember(workspace_id, assigneeId))) {
                    return res.status(400).json({ message: `Assignee ${assigneeId} must be a member of this workspace` });
                }
            }
        }
        
        await client.query('BEGIN');
        
        const newTask = await client.query(
            'INSERT INTO tasks (user_id, title, due_date, workspace_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [req.user.id, title, due_date || null, workspace_id, status || 'active']
        );
        const task = newTask.rows[0];
        
        // Add assignees
        if (assignee_ids && assignee_ids.length > 0) {
            const values = assignee_ids.map(id => `(${task.id}, ${id})`).join(', ');
            await client.query(`INSERT INTO task_assignees (task_id, user_id) VALUES ${values}`);
        }
        
        await client.query('COMMIT');
        res.status(201).json(task);
    } catch (error) {
        await client.query('ROLLBACK');
        next(error); 
    } finally {
        client.release();
    }
}

// Update task
export const updateTask = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { title, due_date, status, assignee_ids } = req.body;
        
        // Fetch existing task
        const existing = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (!existing.rows.length) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const current = existing.rows[0];

        if (!(await isWorkspaceMember(current.workspace_id, req.user.id))) {
            return res.status(403).json({ message: "Not a member of this workspace" });
        }

        // Validate assignee_ids are workspace members
        if (assignee_ids && assignee_ids.length > 0) {
            for (const assigneeId of assignee_ids) {
                if (!(await isWorkspaceMember(current.workspace_id, assigneeId))) {
                    return res.status(400).json({ message: `Assignee ${assigneeId} must be a member of this workspace` });
                }
            }
        }

        await client.query('BEGIN');
        
        // Use provided value if it exists, otherwise keep old value
        const updatedTitle = title ?? current.title;
        const updatedDueDate = due_date ?? current.due_date;
        const updatedStatus = status ?? current.status;

        const result = await client.query(
            `UPDATE tasks SET title = $1, due_date = $2, status = $3 WHERE id = $4 RETURNING *`,
            [updatedTitle, updatedDueDate, updatedStatus, id]
        );
        
        // Update assignees
        if (assignee_ids !== undefined) {
            await client.query('DELETE FROM task_assignees WHERE task_id = $1', [id]);
            if (assignee_ids && assignee_ids.length > 0) {
                const values = assignee_ids.map(assigneeId => `(${id}, ${assigneeId})`).join(', ');
                await client.query(`INSERT INTO task_assignees (task_id, user_id) VALUES ${values}`);
            }
        }
        
        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

// Delete task
export const deleteTask = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        
        // Fetch task to check workspace membership
        const taskResult = await client.query('SELECT workspace_id FROM tasks WHERE id = $1', [id]);
        if (!taskResult.rows.length) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const task = taskResult.rows[0];

        if (!(await isWorkspaceMember(task.workspace_id, req.user.id))) {
            return res.status(403).json({ message: "Not a member of this workspace" });
        }

        await client.query('BEGIN');
        await client.query('DELETE FROM task_assignees WHERE task_id = $1', [id]);
        await client.query('DELETE FROM tasks WHERE id = $1', [id]);
        await client.query('COMMIT');
        
        res.json({ message: 'Task deleted' });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
}