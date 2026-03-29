import React, { useEffect } from 'react'
import useTasks from '../hooks/useTasks'; // ← change to this
import Column from './Column';
import { useParams } from 'react-router-dom';

const Board = () => {
  const { id } = useParams(); // Workspace id
  const { tasks, workspaces, currentWorkspace, setCurrentWorkspace, fetchWorkspaces } = useTasks();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]); // fetch on mount

  useEffect(() => {
      if (!workspaces.length) return;
      if (id) {
          const workspace = workspaces.find(w => w.id === parseInt(id));
          if (workspace) setCurrentWorkspace(workspace);
      } else if (!currentWorkspace) {
          setCurrentWorkspace(workspaces[0]);
      }
  }, [id, workspaces]); // intentionally omit currentWorkspace and setCurrentWorkspace
  
  if (!workspaces.length) {
    return <div className="board">You have not created a workspace yet...</div>;
  }

  if (!currentWorkspace) {
    return <div className="board">Loading workspaces...</div>;
  }

  const columns = {
    'To Do': tasks.filter(t => t.status === 'active'),
    'In-Progress': tasks.filter(t => t.status === 'in-progress'),
    'Completed': tasks.filter(t => t.status === 'completed'),
  };

  return (
    <div className="board">
      <h1>{currentWorkspace.name} Board</h1>
      <div className="columns">
        {Object.entries(columns).map(([status, statusTasks]) => (
          <Column key={status} title={status} tasks={statusTasks}/>
        ))}
      </div>
    </div>
  );
};

export default Board;
