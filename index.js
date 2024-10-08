const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to decode the JWT without verification
const decodeToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(req.headers)
    // JWT is typically sent in the format "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token====",token);
    console.log("params=",req.query)
    if (undefined == token) {
        console.log("redirecting");
        // Redirect to the default URL if the token is not present
        return res.redirect('https://portal-kong.zelarsoft.com/default');
    }

    try {
        console.log("not redirecting");
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
    console.log("params=",req)
    res.json({
        message: 'User information retrieved successfully',
        user: req.user  // This contains the decoded token data
    });
});

app.get('/set-session', decodeToken, (req, res) => {
    console.log("params=",req.query)
    return res.redirect('https://portal-kong.zelarsoft.com/default');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
