import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bookAppointment, fetchBookedSlots } from '../Actions/appointmentActions';
import '../styles/main.css';

const Main = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedPricing, setSelectedPricing] = useState('');
    const [userId, setUserId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDoctor, setSelectedDoctor] = useState(''); // State for selected doctor
    const [errors, setErrors] = useState({}); // State for error messages

    const bookedSlots = useSelector(state => state.appointment.bookedSlots);

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    const pricingOptions = [
        { label: 'General Consultation', price: '$50' },
        { label: 'Specialist Consultation', price: '$100' },
        { label: 'Follow-up Appointment', price: '$30' },
        { label: 'Telehealth Consultation', price: '$40' }
    ];

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setUserId(user.id || '');
        }
    }, []);

    useEffect(() => {
        if (selectedDate && selectedDoctor) {
            // Log the doctor name being sent for fetching booked slots
            console.log('Fetching booked slots for doctor:', selectedDoctor);
            dispatch(fetchBookedSlots(selectedDate, selectedDoctor));
        }
    }, [selectedDate, selectedDoctor, dispatch]);

    const handleTimeSelect = (time) => {
        if (!bookedSlots.includes(time)) {
            setSelectedTime(time);
        }
    };

    const handlePricingSelect = (pricing) => {
        setSelectedPricing(pricing);
    };

    const handleDoctorSelect = (e) => {
        setSelectedDoctor(e.target.value); // Update selected doctor
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const doctor = selectedDoctor; // Use the selected doctor directly

        // Validate that all required fields are filled
        if (!name || !email || !selectedDate || !selectedPricing || (selectedPricing && !doctor) || !selectedTime) {
            console.error('Please fill in all fields before submitting.');
            const newErrors = {
                pricing: !selectedPricing ? '⚠️required.' : '',
                doctor: selectedPricing && !doctor ? '⚠️required.' : '', // Only show error if pricing is selected
                time: !selectedTime ? '⚠️required.' : '',
            };
            setErrors(newErrors);

            // Clear errors after 5 seconds
            setTimeout(() => {
                setErrors({});
            }, 5000);

            return; // Exit the function if validation fails
        }

        const appointmentData = {
            userId: userId || null,
            username: userId ? null : name,
            email,
            date: selectedDate,
            pricing: selectedPricing,
            doctor,
            time: selectedTime,
        };

        console.log('Sending appointment data:', appointmentData);

        const result = await dispatch(bookAppointment(appointmentData));

        if (result && result.success) {
            navigate('/thank-you');
        } else {
            console.error('Booking failed:', result ? result.message : 'No result returned');
        }
    };

    return (
        <div className="container">
            <form className="appointment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Name:
                        <input 
                            type="text" 
                            name="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </label>
                    {errors.name && <span className="error">{errors.name}</span>} {/* Error message */}
                </div>
                <div className="form-group">
                    <label>
                        Email:
                        <input 
                            type="email" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </label>
                    {errors.email && <span className="error">{errors.email}</span>} {/* Error message */}
                </div>
                <div className="form-group">
                    <label>
                        Date:
                        <input 
                            type="date" 
                            name="date" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)} 
                            required 
                        />
                    </label>
                    {errors.date && <span className="error">{errors.date}</span>} {/* Error message */}
                </div>
                <div className="form-group">
                    <label>
                        Pricing:
                        <div className="pricing-options">
                            {pricingOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className={`pricing-option ${selectedPricing === option.label ? 'selected' : ''}`}
                                    onClick={() => handlePricingSelect(option.label)}
                                >
                                    {option.label} - {option.price}
                                </div>
                            ))}
                        </div>
                    </label>
                    {errors.pricing && <span className="error">{errors.pricing}</span>} {/* Error message */}
                </div>
                {selectedPricing && (
                    <div className="form-group">
                        <label>
                            Doctor:
                            <select name="doctor" onChange={handleDoctorSelect} required>
                                <option value="">Select...</option>
                                <option value="doctor janaki">Dr. Janaki</option>
                                <option value="doctor vinu">Dr. Vinu</option>
                            </select>
                        </label>
                        {errors.doctor && <span className="error">{errors.doctor}</span>} {/* Error message */}
                    </div>
                )}
                <div className="form-group">
                    <label>
                        Time:
                        <div className="time-slots">
                            {timeSlots.map((time, index) => (
                                <div
                                    key={index}
                                    className={`time-slot ${selectedTime === time ? 'selected' : ''} ${bookedSlots.includes(time) ? 'booked' : ''}`}
                                    onClick={() => handleTimeSelect(time)}
                                    style={{ cursor: bookedSlots.includes(time) ? 'not-allowed' : 'pointer', opacity: bookedSlots.includes(time) ? 0.5 : 1 }}
                                >
                                    {time}
                                </div>
                            ))}
                        </div>
                    </label>
                    {errors.time && <span className="error">{errors.time}</span>} {/* Error message */}
                </div>
                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
}

export default Main;
