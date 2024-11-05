const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body; // Include role in the request body

    console.log('Email:', email);
    // Avoid logging sensitive information like passwords in production

    try {
        const { user, doctor, token } = await authService.login(email, password, role); // Pass role to the service
        
        if (user) {
            console.log('User object:', user);
            return res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                token: token,
            });
        } else if (doctor) {
            console.log('Doctor object:', doctor);
            return res.json({
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                token: token,
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(401).json({ message: err.message });
    }
});


module.exports = router;
