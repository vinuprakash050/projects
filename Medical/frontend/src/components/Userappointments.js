import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAppointments, updateAppointment, fetchBookedSlots } from '../Actions/appointmentActions';
import '../styles/userappointments.css';
import Modal from 'react-modal';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const Appointments = () => {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  const appointments = useSelector(state => state.appointment.appointments);
  const bookedSlots = useSelector(state => state.appointment.bookedSlots);

  useEffect(() => {
    if (userId) {
      setLoading(true); // Set loading to true before fetching data
      dispatch(fetchUserAppointments(userId)).then(() => {
        setLoading(false); // Set loading to false after data is fetched
      });
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (selectedDate && selectedAppointment?.doctor) {
      dispatch(fetchBookedSlots(selectedDate, selectedAppointment.doctor));
    }
  }, [selectedDate, selectedAppointment, dispatch]);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAppointment(null);
    setSelectedDate('');
    setSelectedTimeSlot('');
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTimeSlot) {
      const newErrors = {
        date: !selectedDate ? '⚠️required.' : '',
        time: !selectedTimeSlot ? '⚠️required.' : '',
      };
      setErrors(newErrors);

      setTimeout(() => {
        setErrors({});
      }, 5000);

      return;
    }

    const updatedAppointment = {
      ...selectedAppointment,
      userId,
      date: selectedDate,
      time: selectedTimeSlot,
      status: 'rescheduled', // Update status to rescheduled
      updated_at: new Date().toISOString()
    };
  
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAppointment)
      });
  
      if (response.ok) {
        dispatch(updateAppointment(selectedAppointment.id, updatedAppointment)); // Pass updatedAppointment here
        dispatch(fetchUserAppointments(userId)); // Fetch updated appointments
        closeModal();
      } else {
        console.error('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  if (!user) {
    return <p>Please log in to view your appointments.</p>;
  }

  return (
    <div className="appointments-page">
      <h1>Your Appointments</h1>
      {loading ? (
        <div className="loading-screen">Loading...</div>
      ) : (
        <>
          {appointments.length > 0 ? (
            <ul>
              {appointments.map((appointment) => {
                let doctorDetails = appointment.doctor;
                if (typeof doctorDetails === 'string') {
                  try {
                    doctorDetails = JSON.parse(doctorDetails);
                  } catch (e) {
                    doctorDetails = { name: doctorDetails };
                  }
                }

                return (
                  <li key={appointment.id}>
                    <div className="appointment-header">
                      <div className="header-left">
                        <h2>{appointment.pricing || 'N/A'}</h2>
                        <span className={`status ${appointment.status}`}>{appointment.status}</span>
                      </div>
                      {appointment.status === 'canceled' && (
                        <button onClick={() => openModal(appointment)}>Reschedule</button>
                      )}
                    </div>
                    <div className="appointment-details">
                      <div className="left">
                        <div className="appointment-detail">
                          <strong>Appointment On:</strong> <span>{new Date(appointment.date).toLocaleDateString()} {appointment.time}</span>
                        </div>
                        <div className="appointment-detail">
                          <strong>Doctor:</strong> <span>{doctorDetails.name || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="right">
                        <div className="appointment-detail">
                          <strong>Appointment:</strong> <span>{appointment.pricing}</span>
                        </div>
                        <div className="appointment-detail">
                          <strong>Booked On:</strong> <span>{new Date(appointment.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No appointments available.</p>
          )}
        </>
      )}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Reschedule Appointment" className="modal" overlayClassName="modal-overlay">
        <h2>Reschedule Appointment</h2>
        <form onSubmit={handleSave}>
          <div>
            <label>
              Select Date:
              <input type="date" value={selectedDate} onChange={handleDateChange} />
              {errors.date && <span className="error">{errors.date}</span>}
            </label>
          </div>
          <div>
            <label>
              Select Time Slot:
              <select value={selectedTimeSlot} onChange={handleTimeSlotChange}>
                <option value="">Select a time slot</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot} disabled={bookedSlots.includes(slot)}>
                    {slot} {bookedSlots.includes(slot) ? '(Booked)' : ''}
                  </option>
                ))}
              </select>
              {errors.time && <span className="error">{errors.time}</span>}
            </label>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
