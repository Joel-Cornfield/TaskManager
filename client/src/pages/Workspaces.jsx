import React, { useEffect } from 'react'
import useTasks from '../hooks/useTasks'
import WorkspaceList from '../components/WorkspaceList';

const Workspaces = () => {
  const { workspaces, fetchWorkspaces } = useTasks();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <WorkspaceList workspaces={workspaces} />
  );
};

export default Workspaces;
