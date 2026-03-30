import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskForm from './TaskForm';
import WorkspaceForm from './WorkspaceForm';

const Navbar = () => {
    const { state, dispatch } = useTasks();
    const { workspaces, token } = state;
    const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const navLeftRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navLeftRef.current && !navLeftRef.current.contains(event.target)) {
                setShowWorkspaceDropdown(false);
                setShowCreateMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setModalType('');
        setShowModal(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left" ref={navLeftRef}>
                    <Link to="/" className="navbar-title">Task Manager</Link>
                    {token && 
                        <div className="navbar-center">
                            <div className="workspace-section">
                                <button
                                    className="workspace-btn"
                                    onClick={() => {
                                        setShowWorkspaceDropdown(!showWorkspaceDropdown);
                                        setShowCreateMenu(false);
                                    }}
                                >
                                    Workspaces
                                    <span className={`dropdown-arrow ${showWorkspaceDropdown ? 'open' : ''}`}>▼</span>
                                </button>
                                {showWorkspaceDropdown && (
                                    <div className="workspace-dropdown">
                                        <Link to="/workspaces" onClick={() => setShowWorkspaceDropdown(false)}>View all workspaces</Link>
                                        <hr />
                                        {workspaces?.map(workspace => (
                                            <Link
                                                key={workspace.id}
                                                to={`/workspace/${workspace.id}`}
                                                onClick={() => setShowWorkspaceDropdown(false)}
                                            >
                                                {workspace.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="create-section">
                                <button
                                    className='create-btn'
                                    onClick={() => {
                                        setShowCreateMenu(!showCreateMenu);
                                        setShowWorkspaceDropdown(false);
                                    }}
                                >
                                    + Create
                                    <span className={`dropdown-arrow ${showCreateMenu ? 'open' : ''}`}>▼</span>
                                </button>
                                {showCreateMenu && (
                                    <div className="create-menu">
                                        <button onClick={() => { openModal('task'); setShowCreateMenu(false); }}>New Task</button>
                                        <button onClick={() => { openModal('workspace'); setShowCreateMenu(false); }}>New Workspace</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </div>
                <div className="navbar-right">
                    {token ? (
                        <button className='logout-btn' onClick={handleLogout}>Logout</button>
                    ) : (
                        <Link to="/login" className="login-btn">Login</Link>
                    )}
                </div>
            </nav>
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className='modal-close' onClick={closeModal}>×</button>
                        {modalType === 'task' && <TaskForm onClose={closeModal} />}
                        {modalType === 'workspace' && <WorkspaceForm onClose={closeModal} />}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;