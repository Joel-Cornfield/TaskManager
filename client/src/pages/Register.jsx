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
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
            <button type="submit">Register</button>
            <p>
                    Already have an account? <Link to="/login">Click here</Link>
            </p>
        </form>
    );
};

export default Register;
