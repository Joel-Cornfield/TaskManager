import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

const Navbar = () => {
    const { state, dispatch } = useTasks();
    const { workspaces, memberWorkspaces, token } = state;
    const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
    const navLeftRef = useRef(null);
    const currentPath = window.location.pathname;

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navLeftRef.current && !navLeftRef.current.contains(event.target)) {
                setShowWorkspaceDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left" ref={navLeftRef}>
                    <img src="../logo.svg" className='navbar-logo' alt='logo'></img>
                    <Link to="/" className="navbar-title">Task Manager</Link>
                    {token && 
                        <div className="navbar-center">
                            <div className="workspace-nav">
                                <button
                                    className="workspace-btn"
                                    onClick={() => {
                                        setShowWorkspaceDropdown(!showWorkspaceDropdown);
                                    }}
                                >
                                    Workspaces
                                    <span className={`dropdown-arrow ${showWorkspaceDropdown ? 'open' : ''}`}>▼</span>
                                </button>
                                {showWorkspaceDropdown && (
                                    <div className="workspace-dropdown">
                                        <Link to="/workspaces" onClick={() => setShowWorkspaceDropdown(false)}>View all workspaces</Link>
                                        <hr />
                                        {workspaces?.slice(0,2).map(workspace => (
                                            <Link
                                                key={workspace.id}
                                                to={`/workspace/${workspace.id}`}
                                                onClick={() => setShowWorkspaceDropdown(false)}
                                            >
                                                {workspace.name}
                                            </Link>
                                        ))}
                                        {memberWorkspaces?.slice(0,2).map(workspace => (
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
                        </div>
                    }
                </div>
                <div className="navbar-right">
                    {token ? (
                        <div className="navbar-user-section">
                            <Link to="/profile" className="profile-link">
                                {state.user?.profile_image ? (
                                    <img
                                        src={`http://localhost:4000${state.user.profile_image}`}
                                        alt="Profile"
                                        className="navbar-profile-image"
                                    />
                                ) : (
                                    <div className="navbar-profile-placeholder">
                                        {state.user?.name ? state.user.name.charAt(0).toUpperCase() : state.user?.email.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </Link>
                            <button className='logout-btn' onClick={handleLogout}>Logout</button>
                        </div>
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