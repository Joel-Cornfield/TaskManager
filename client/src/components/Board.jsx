import React, { useEffect, useState } from 'react'
import useTasks from '../hooks/useTasks'; // ← change to this
import Column from './Column';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from './Spinner';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskForm from './TaskForm';

const statusFromColumn = {
  'To Do': 'active',
  'In-Progress': 'in-progress',
  'Completed': 'completed',
};

const Board = () => {
  const { id } = useParams(); // Workspace id
  const { tasks, loading, loadingWorkspaces, workspaces, currentWorkspace, setCurrentWorkspace, fetchWorkspaces, updateTask } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [taskStatus, setTaskStatus] = useState('active');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]); // fetch on mount

  useEffect(() => {
      if (!workspaces.length) return;
      if (id) {
          const workspace = workspaces.find(w => w.id === parseInt(id));
          if (workspace && workspace.id !== currentWorkspace?.id) {
              setCurrentWorkspace(workspace);
          }
      } else if (!currentWorkspace && workspaces.length > 0) {
          setCurrentWorkspace(workspaces[0]);
      }
  }, [id, workspaces, currentWorkspace?.id]); // Add currentWorkspace?.id to dependencies

  const onTaskDrop = async (item, columnTitle) => {
    const newStatus = statusFromColumn[columnTitle];
    if (!newStatus || item.status === newStatus) return;
    await updateTask(item.id, { ...item, status: newStatus });
  }

  const openModal = (type, status = 'active') => {
    setModalType(type);
    setTaskStatus(status);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalType('');
    setTaskStatus('active');
    setShowModal(false);
  };
  
  if (loadingWorkspaces) return (
      <div className="board">
        <Spinner message="Loading workspaces..." />
      </div>
  ); 

  useEffect(() => {
    if (!loadingWorkspaces && !workspaces.length) {
      navigate('/workspaces');
    }
  }, [loadingWorkspaces, workspaces.length, navigate]);

  if (!currentWorkspace) return (
      <div className="board">
        <Spinner message="Loading workspaces..." />
      </div>
  );
  
  if (loading) return (
      <div className='board'>
        <Spinner message="Loading tasks..." />;
      </div>
  );

  const columns = {
    'To Do': tasks.filter(t => t.status === 'active'),
    'In-Progress': tasks.filter(t => t.status === 'in-progress'),
    'Completed': tasks.filter(t => t.status === 'completed'),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board">
        <h1>{currentWorkspace.name}</h1>
        <div className="columns">
          {Object.entries(columns).map(([status, statusTasks]) => (
            <Column key={status} title={status} tasks={statusTasks} onDrop={onTaskDrop} onAddTask={() => openModal('task', statusFromColumn[status])}/>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className='modal-close' onClick={closeModal}>×</button>
            {modalType === 'task' && <TaskForm onClose={closeModal} status={taskStatus} />}
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default Board;
