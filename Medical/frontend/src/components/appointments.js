import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { fetchAppointments, cancelAppointment } from '../Actions/appointmentActions';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/appointments.css';

const Appointments = () => {
  const dispatch = useDispatch();
  const appointments = useSelector(state => state.appointment.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with current date
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const doctorName = user ? user.name : null;

  useEffect(() => {
    if (doctorName && selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      dispatch(fetchAppointments(doctorName, formattedDate));
    }
  }, [dispatch, doctorName, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = appointments.filter(appointment => {
        const appointmentDate = formatDate1(appointment.date);
        const appointmentTime = convertTo24Hour(appointment.time);
        const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(startHours, startMinutes);
        
        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(endHours, endMinutes);

        return appointmentDateTime >= startDateTime && appointmentDateTime <= endDateTime;
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments([]);
    }
  }, [selectedDate, startTime, endTime, appointments]);

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

  const formatDate1 = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleString('en-US', options);
  };

  const handleCancelAppointment = (appointmentId) => {
    console.log("Cancelling appointment with ID:", appointmentId);
    dispatch(cancelAppointment(appointmentId)).then((result) => {
        if (result.success) {
            // Fetch appointments again to reflect the updated status
            const formattedDate = selectedDate.toISOString().split('T')[0];
            dispatch(fetchAppointments(doctorName, formattedDate));
        } else {
            console.error('Failed to cancel appointment:', result.message);
        }
    }).catch(error => {
        console.error('Error cancelling appointment:', error);
    });
  };

  return (
    <div className="appointments-page">
      <div className="appointments-container">
        <div className="date-picker">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setFilteredAppointments([]); // Clear the filtered appointments state
            }}
            inline
            dateFormat="yyyy/MM/dd"
          />
          <div className="time-filters">
            <label>
              Start Time:
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </label>
            <label>
              End Time:
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="appointments-list">
          {filteredAppointments.length > 0 ? (
            <ul>
              {filteredAppointments.map((appointment, index) => (
                <li key={`${appointment.appointment_id}-${index}`} className="appointment-item">
                  <div className="appointment-details">
                    <strong>Patient Name:{appointment.name}</strong> 
                  </div>
                  <div>
                    {formatDate(appointment.date)} at {appointment.time}
                  </div>
                  <button
                    className={`cancel-button ${appointment.status === 'canceled' ? 'cancelled-button' : ''}`}
                    onClick={() => handleCancelAppointment(appointment.appointment_id)}
                    disabled={appointment.status === 'canceled'}
                  >
                    {appointment.status === 'canceled' ? 'Cancelled' : 'Cancel'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments available for this date and time frame.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
