const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to decode the JWT without verification
const decodeToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // JWT is typically sent in the format "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        // Decode the token without verification
        const decoded = jwt.decode(token);
        
        if (!decoded) {
            return res.status(401).json({ message: 'Failed to decode token' });
        }

        req.user = decoded;  // Store the decoded token data in the request object
        next();  // Pass control to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: 'Error decoding token' });
    }
};

// Protected route that requires a decoded JWT
app.get('/user-info', decodeToken, (req, res) => {
    res.json({
        message: 'User information retrieved successfully',
        user: req.user  // This contains the decoded token data
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
