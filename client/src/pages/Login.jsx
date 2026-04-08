import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTasks from '../hooks/useTasks';
import Spinner from '../components/Spinner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loadingAuth } = useTasks();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            setError(error?.response?.data?.message || 'Login failed');        }
    };

    if (loadingAuth) return (
        <div className='board'>
            <Spinner message="Logging in user..."/>
        </div>
    )

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
            <button type="submit">Login</button>
            <p>
                    Create an account? <Link to="/register">Click here</Link>
            </p>
        </form>
    );
};

export default Login;
