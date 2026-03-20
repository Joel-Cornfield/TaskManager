import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    let token;

    // Get token from headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Attach user to request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}