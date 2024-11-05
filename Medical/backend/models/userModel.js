const { Client } = require('pg');

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "1dragvin",
    database: "project"
});

const connectToDatabase = async () => {
    try {
        await con.connect();
        console.log("Connected to PostgreSQL");
    } catch (err) {
        console.error('Connection error', err.stack);
    }
};

// Function to get user or doctor by email
const getUserByEmail = async (email) => {
    if (!email) {
        throw new Error('Email is required');
    }

    try {
        // Check in users table
        const userResult = await con.query("SELECT * FROM public.users WHERE email = $1", [email]);
        
        // Check in doctors table
        const doctorResult = await con.query("SELECT * FROM public.doctors WHERE email = $1", [email]);

        return {
            user: userResult.rows[0] || null, // Return user if found, else null
            doctor: doctorResult.rows[0] || null // Return doctor if found, else null
        };
    } catch (err) {
        console.error('Error fetching user or doctor:', err);
        throw new Error('Database query failed');
    }
};

// Call this function to connect to the database when your application starts
connectToDatabase();

module.exports = {
    getUserByEmail,
};
