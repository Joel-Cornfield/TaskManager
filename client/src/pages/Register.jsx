import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTasks from '../hooks/useTasks';
import Spinner from '../components/Spinner';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, loadingAuth } = useTasks();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            navigate('/login');
        } catch (error) {
            setError(error?.response?.data?.message || 'Register failed');        }
    };

    if (loadingAuth) return (
        <div className='board'>
            <Spinner message="Registering user..."/>
        </div>
    )

    return (
        <div className="auth-page">
            <div className="auth-card">
            <h2>Create account</h2>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <button type="submit" className="auth-submit">Create account</button>
            </form>
            <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
        </div>
    );
};

export default Register;
