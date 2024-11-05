const express = require('express');
const cors = require('cors');
const { Client } = require('pg'); // Import the pg Client
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000; // Use uppercase for environment variables

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "1dragvin",
    database: "project"
});

con.connect().catch(err => console.error('Connection error', err.stack));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('profileImage');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes); // Use the auth routes

app.post('/api/doctors/:id/photo', (req, res) => {
    upload(req, res, async (err) => {
        const { id } = req.params;
        console.log('Photo update request received for ID:', id);

        if (err) {
            console.error('Error during file upload:', err);
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const profileImagePath = `/uploads/${req.file.filename}`;
            console.log('Profile image path:', profileImagePath);

            const result = await con.query(
                'UPDATE public.doctors SET profile_image = $1 WHERE id = $2 RETURNING *',
                [profileImagePath, id]
            );

            if (result.rows.length === 0) {
                console.log('Doctor not found for ID:', id);
                return res.status(404).json({ message: 'Doctor not found' });
            }

            const doctor = result.rows[0];
            console.log('Profile photo updated successfully for doctor:', doctor);
            res.status(200).json(doctor);
        } catch (err) {
            console.error('Error updating profile photo:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });
});


app.post('/api/register', upload, async (req, res) => {
    const { name, email, password, role, doctorId, experience, hospital, specialistIn } = req.body; // Extract data from the request body
    console.log('Register request received:', req.body); // Log the request body

    try {
        // Check if the email already exists in both tables
        const emailCheck = await con.query('SELECT * FROM public.users WHERE email = $1', [email]);
        const doctorEmailCheck = await con.query('SELECT * FROM public.doctors WHERE email = $1', [email]);

        if (emailCheck.rows.length > 0 || doctorEmailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing

        let result;
        let profileImagePath = '/uploads/default-profile.png'; // Default profile picture path

        if (req.file) {
            profileImagePath = `/uploads/${req.file.filename}`;
        }

        if (role === 'doctor') {
            // Insert into doctors table
            result = await con.query(
                'INSERT INTO public.doctors (name, email, password, doctor_id, experience, hospital, specialist_in, profile_image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [name, email, hashedPassword, doctorId, experience, hospital, specialistIn, profileImagePath] // Use hashed password and additional fields
            );
        } else {
            // Insert into users table
            result = await con.query(
                'INSERT INTO public.users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [name, email, hashedPassword] // Use hashed password
            );
        }

        const user = result.rows[0]; // Get the inserted user/doctor
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: jwt.sign({ id: user.id, email: user.email, name: user.name }, 'secret', { expiresIn: '1h' }),
        });
    } catch (err) {
        console.error('Error during registration:', err); // Log the error
        res.status(500).json({ message: 'Server error' }); // Return a JSON response
    }
});



app.get('/api/doctors/:id', async (req, res) => {
    const { id } = req.params; // Extract doctor ID from URL parameters
    console.log('Fetch doctor profile request received for ID:', id); // Log the request

    try {
        // Query the doctors table to get the doctor's profile
        const result = await con.query(
            'SELECT name, email, doctor_id, experience, hospital, specialist_in, profile_image FROM public.doctors WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const doctor = result.rows[0]; // Get the doctor's profile
        res.status(200).json(doctor); // Return the doctor's profile
    } catch (err) {
        console.error('Error fetching doctor profile:', err); // Log the error
        res.status(500).json({ message: 'Server error' }); // Return a JSON response
    }
});




// Existing appointment booking endpoint
app.post('/api/appointments', async (req, res) => {
    console.log('Request body:', req.body);

    const { userId, username, doctor, date, time, pricing } = req.body;

    console.log('Received appointment data:', {
        userId,
        username,
        doctor,
        date,
        time,
        pricing
    });

    // Check for missing fields
    if (!doctor || !date || !time || !pricing || (!userId && !username)) {
        console.error('Missing required fields');
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        if (userId) {
            // Check if the appointment already exists for the user
            console.log('Checking for existing appointment...');
            const existingAppointment = await con.query(
                'SELECT * FROM appointments WHERE user_id = $1 AND date = $2 AND time = $3',
                [userId, date, time]
            );

            console.log('Existing appointment check result:', existingAppointment.rows);

            if (existingAppointment.rows.length > 0) {
                // Update the existing appointment
                console.log('Updating existing appointment...');
                await con.query(
                    'UPDATE appointments SET doctor = $1, pricing = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 AND date = $4 AND time = $5',
                    [doctor, pricing, userId, date, time]
                );
                return res.status(200).json({ success: true, message: 'Appointment updated successfully' });
            } else {
                // Insert a new appointment for the user
                console.log('Inserting new appointment...');
                await con.query(
                    'INSERT INTO appointments (user_id, doctor, date, time, pricing) VALUES ($1, $2, $3, $4, $5)',
                    [userId, doctor, date, time, pricing]
                );
                return res.status(201).json({ success: true, message: 'Appointment booked successfully' });
            }
        } else {
            // If no userId, insert into the guest table with username
            console.log('Inserting new guest appointment...');
            await con.query(
                'INSERT INTO guest (username, doctor, date, time, pricing) VALUES ($1, $2, $3, $4, $5)',
                [username, doctor, date, time, pricing]
            );
            return res.status(201).json({ success: true, message: 'Guest appointment booked successfully' });
        }
    } catch (err) {
        console.error('Error booking appointment:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// New endpoint for updating appointments
app.put('/api/appointments/:id', async (req, res) => {
    console.log('Request received at /api/appointments/:id');
    console.log('Request body:', req.body);

    const { id } = req.params;
    const { userId, doctor, date, time, pricing } = req.body;

    console.log('Received update data:', {
        id,
        userId,
        doctor,
        date,
        time,
        pricing
    });

    // Check for missing fields
    if (!doctor || !date || !time || !pricing || !userId) {
        console.error('Missing required fields');
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Check if the appointment exists
        console.log('Checking for existing appointment...');
        const existingAppointment = await con.query(
            'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        console.log('Existing appointment check result:', existingAppointment.rows);

        if (existingAppointment.rows.length > 0) {
            // Update the existing appointment
            console.log('Updating existing appointment...');
            await con.query(
                'UPDATE appointments SET doctor = $1, date = $2, time = $3, pricing = $4, updated_at = CURRENT_TIMESTAMP, status = $7 WHERE id = $5 AND user_id = $6',
                [doctor, date, time, pricing, id, userId,"online"]
            );
            console.log('Appointment updated successfully');
            return res.status(200).json({ success: true, message: 'Appointment updated successfully' });
        } else {
            console.error('Appointment not found');
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
    } catch (err) {
        console.error('Error updating appointment:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});




app.get('/api/fetchappointments', async (req, res) => {
    const { doctorName } = req.query; // Get doctor name from query parameters

    if (!doctorName) {
        return res.status(400).json({ success: false, message: 'Doctor name is required' });
    }

    try {
        const query = `
            SELECT a.id AS appointment_id, a.user_id, a.doctor, a.date, a.time, a.pricing, a.created_at, a.updated_at, a.status,
                   u.name, u.email
            FROM appointments a
            JOIN users u ON a.user_id = u.id
            WHERE a.doctor = $1
            ORDER BY a.date, a.time
        `;
        const appointments = await con.query(query, [doctorName]);
        
        // Log the fetched appointments
        console.log('Fetched appointments:', appointments.rows);
        
        return res.status(200).json({ success: true, appointments: appointments.rows });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});




// Fetch appointments for a specific user by user ID
app.get('/api/fetchuserappointments', async (req, res) => {
    const { userId } = req.query; // Get user ID from query parameters

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const appointments = await con.query(
            'SELECT * FROM appointments WHERE user_id = $1 ORDER BY date, time',
            [userId]
        );

        // Log the appointment details to the console
        console.log('Fetched Appointments:', appointments.rows);

        return res.status(200).json({ success: true, appointments: appointments.rows });
    } catch (err) {
        console.error('Error fetching user appointments:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});



app.get('/api/bookedSlots', async (req, res) => {
    const { date, doctor } = req.query; // Get date and doctor name from query parameters

    console.log('Fetching booked slots for date:', date, 'and doctor:', doctor);

    // Check if date and doctor are provided
    if (!date || !doctor) {
        console.error('Date and doctor are required');
        return res.status(400).json({ success: false, message: 'Date and doctor are required' });
    }

    try {
        // Query to get booked slots for the specified date and doctor
        const result = await con.query(
            'SELECT time FROM appointments WHERE date = $1 AND doctor = $2',
            [date, doctor]
        );

        console.log('Booked slots:', result.rows); // Log the booked slots

        // Check if rows exist
        if (!result.rows || result.rows.length === 0) {
            return res.status(200).json({ success: true, bookedSlots: [] }); // Return empty array if no rows
        }

        // Extract booked times from the result
        const bookedSlots = result.rows.map(row => row.time); // Correctly map over result.rows
        return res.status(200).json({ success: true, bookedSlots });
    } catch (err) {
        console.error('Error fetching booked slots:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/appointments/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
    }

    try {
        const result = await con.query(
            'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        return res.status(200).json({ success: true, appointment: result.rows[0] });
    } catch (err) {
        console.error('Error updating appointment status:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});





app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
