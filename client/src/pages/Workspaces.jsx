import React, { useEffect, useState } from 'react'
import useTasks from '../hooks/useTasks'
import WorkspaceList from '../components/WorkspaceList';
import WorkspaceForm from '../components/WorkspaceForm';

const Workspaces = () => {
  const { workspaces, memberWorkspaces, fetchWorkspaces } = useTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <div className='workspaces'>
      <div className='workspaces-header'>
        <h1>Workspaces</h1>
        <button className="create-btn" onClick={() => setShowCreateModal(true)}>
          + Create Workspace
        </button>
      </div>

      <WorkspaceList workspaces={workspaces} memberWorkspaces={memberWorkspaces} />
      
      {showCreateModal && (
        <div className='modal-overlay' onClick={() => setShowCreateModal(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button className='modal-close' onClick={() => setShowCreateModal(false)}>×</button>
            <WorkspaceForm onClose={() => setShowCreateModal(false)}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;

