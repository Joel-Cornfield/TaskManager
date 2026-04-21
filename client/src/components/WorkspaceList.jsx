import React from 'react';
import WorkspaceItem from './WorkspaceItem';

const WorkspaceList = ({ workspaces = [], memberWorkspaces = [] }) => {
  return (
    <div className="workspace-sections">

      {/* =========================
          YOUR WORKSPACES
      ========================= */}
      <div className="workspace-section">
        <div className="workspace-section-header">
          <h2>Your Workspaces</h2>
        </div>

        {workspaces.length === 0 ? (
          <p className="empty-state">No workspaces yet</p>
        ) : (
          <div className="workspace-grid">
            {workspaces.map((workspace) => (
              <WorkspaceItem key={workspace.id} workspace={workspace} />
            ))}
          </div>
        )}
      </div>

      {/* =========================
          SHARED WORKSPACES
      ========================= */}
      <div className="workspace-section shared">
        <div className="workspace-section-header">
          <h2>Shared with You</h2>
        </div>

        {memberWorkspaces.length === 0 ? (
          <p className="empty-state">No shared workspaces</p>
        ) : (
          <div className="workspace-grid">
            {memberWorkspaces.map((workspace) => (
              <WorkspaceItem key={workspace.id} workspace={workspace} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default WorkspaceList;