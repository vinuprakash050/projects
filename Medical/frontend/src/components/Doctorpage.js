import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../Actions/appointmentActions'; // Import your action creators
import '../styles/doctorpage.css'; // Import the CSS file

const DoctorInterface = () => {
  const dispatch = useDispatch();
  
  // Retrieve the doctor's name from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const doctorName = user ? user.name : null; // Get the name if user exists
  console.log('Doctor Name from Local Storage:', doctorName);

  const appointments = useSelector(state => state.appointment.appointments);
  console.log('Appointments from Redux Store:', appointments);

  useEffect(() => {
    // Fetch appointments when the component mounts
    if (doctorName) {
      console.log('Fetching appointments for:', doctorName); // Log the doctor name
      dispatch(fetchAppointments(doctorName)); // Pass the doctor name
    }
  }, [dispatch, doctorName]);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    console.log('Raw Date String:', dateString);
    console.log('Formatted Date Object:', date);

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = date.toLocaleString('en-US', options);
    console.log('Formatted Date:', formattedDate);
    return formattedDate;
  };

  const formatDate1 = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`; // Return in yyyy-mm-dd format
  };

  const convertTo24Hour = (time) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Sort appointments by date and time in descending order
  const sortedAppointments = [...appointments].sort((a, b) => {
    const timeA = convertTo24Hour(a.time); // Convert to 24-hour format
    const timeB = convertTo24Hour(b.time); // Convert to 24-hour format
    const dateAString = `${formatDate1(a.date)}T${timeA}`; // Combine date and time
    const dateBString = `${formatDate1(b.date)}T${timeB}`; // Combine date and time

    console.log('Date A String:', dateAString);
    console.log('Date B String:', dateBString);

    const dateA = new Date(dateAString);
    const dateB = new Date(dateBString);

    console.log('Comparing Dates:', dateA, dateB);
    return dateB - dateA; // Descending order
  });

  console.log('Sorted Appointments:', sortedAppointments);

  return (
    <div className="doctor-interface">
      <h1>Doctor Dashboard</h1>
      <p>Welcome back, Doctor {doctorName}! Here’s what you need to know:</p>

      <section className="appointments">
        <h2>Your Appointments</h2>
        {sortedAppointments.length > 0 ? (
          <ul>
            {sortedAppointments.map((appointment) => (
              <li key={appointment.id}>
                <strong>{appointment.name} ({appointment.pricing+" "})</strong> {formatDate(appointment.date)} at {appointment.time}
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments available.</p>
        )}
      </section>
    </div>
  );
};

export default DoctorInterface;
