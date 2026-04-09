import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

const Navbar = () => {
    const { state, dispatch } = useTasks();
    const { workspaces, token } = state;
    const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const navLeftRef = useRef(null);
    const currentPath = window.location.pathname;

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

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const handleCreateTask = () => {
        if (state.currentWorkspace?.id) {
            navigate(`/workspace/${state.currentWorkspace.id}`);
        } else {
            navigate('/workspaces');
        }
        setShowCreateMenu(false);
    };

    const handleCreateWorkspace = () => {
        navigate('/workspaces');
        setShowCreateMenu(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left" ref={navLeftRef}>
                    <img src="../logo.svg" className='navbar-logo' alt='logo'></img>
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
                                        <button onClick={handleCreateTask}>New Task</button>
                                        <button onClick={handleCreateWorkspace}>New Workspace</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </div>
                <div className="navbar-right">
                    {token ? (
                        <button className='logout-btn' onClick={handleLogout}>Logout</button>
                    ) : currentPath === '/register' ? (
                        <Link to="/login" className="login-btn">Login</Link>
                    ) : (
                        <Link to="/register" className="login-btn">Register</Link>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;