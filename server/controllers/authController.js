import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user 
        const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword]);

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error'});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check user exists 
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        const user = userExists.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '1h' }
            );
            res.json(token);
        } else {
            return res.status(400).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}