import React from 'react';
import WorkspaceItem from './WorkspaceItem';

const WorkspaceList = ({ workspaces } ) => {
  return (
    <div className="column">
        <h2>Your Workspaces</h2>
        {workspaces.length === 0 && <p>No workspaces yet...</p>}
        {workspaces?.map(workspace => (
            <WorkspaceItem key={workspace.id} task={workspace}/>
        ))}
    </div>
  )
}

export default WorkspaceList;
