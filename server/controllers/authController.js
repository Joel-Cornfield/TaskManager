import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

const createToken = (user) => 
    jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h',
    });

export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            res.status(400);
            throw new Error('Email, password, and name required');
        }
        // Check user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user 
        const newUser = await pool.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email', [email, hashedPassword, name]);

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('Email and password required');
        }
        // Check user exists 
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const user = userExists.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
        
        const token = createToken(user);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name }});
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [req.user.id]);
        if (!user.rows.length) return res.status(404).json({ message: 'User not found' });
        res.json({ user: user.rows[0] });
    } catch (error) {
        next(error);
    }
}