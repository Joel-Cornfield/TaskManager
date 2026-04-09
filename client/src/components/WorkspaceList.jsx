import React from 'react';
import WorkspaceItem from './WorkspaceItem';

const WorkspaceList = ({ workspaces } ) => {
  return (
    <div className="workspace-list">
        <h2>Your Workspaces</h2>
        {workspaces.length === 0 && <p>No workspaces yet...</p>}
        <div className='workspace-grid'>
            {workspaces?.map((workspace) => (
              <WorkspaceItem key={workspace.id} workspace={workspace}/>
            ))}
        </div>
    </div>
  );
};

export default WorkspaceList;
