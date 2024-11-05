const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const userModel = require('../models/userModel');

const login = async (email, password, role) => {
    const { user, doctor } = await userModel.getUserByEmail(email);

    if (role === 'user' && user) {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Email: ${user.email}, Role: user, Password Match: ${isMatch}`);
        if (isMatch) {
            const token = jwt.sign(
                { id: user.id, email: user.email, name: user.name, role: 'user' },
                'secret',
                { expiresIn: '1h' }
            );
            return { user, token };
        } else {
            throw new Error('Invalid email or password');
        }
    } else if (role === 'doctor' && doctor) {
        const isMatch = await bcrypt.compare(password, doctor.password);
        console.log(`Email: ${doctor.email}, Role: doctor, Password Match: ${isMatch}`);
        if (isMatch) {
            const token = jwt.sign(
                { id: doctor.id, email: doctor.email, name: doctor.name, role: 'doctor' },
                'secret',
                { expiresIn: '1h' }
            );
            return { doctor, token };
        } else {
            throw new Error('Invalid email or password');
        }
    } else {
        throw new Error('Invalid role or user not found');
    }
};

module.exports = {
    login,
};
