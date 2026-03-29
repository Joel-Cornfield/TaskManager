import React from 'react';
import WorkspaceItem from './WorkspaceItem';

const WorkspaceList = ({ workspaces } ) => {
  return (
    <div className="workspace-list">
        <h2>Your Workspaces</h2>
        {workspaces.length === 0 && <p>No workspaces yet...</p>}
        {workspaces?.map((workspace) => (
            <WorkspaceItem key={workspace.id} workspace={workspace}/>
        ))}
    </div>
  );
};

export default WorkspaceList;
