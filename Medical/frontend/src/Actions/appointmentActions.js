import {
    FETCH_BOOKED_SLOTS_REQUEST,
    FETCH_BOOKED_SLOTS_SUCCESS,
    FETCH_BOOKED_SLOTS_FAILURE,
    BOOK_APPOINTMENT_REQUEST,
    BOOK_APPOINTMENT_SUCCESS,
    BOOK_APPOINTMENT_FAILURE,
    FETCH_APPOINTMENTS_REQUEST,
    FETCH_APPOINTMENTS_SUCCESS,
    FETCH_APPOINTMENTS_FAILURE,
    CANCEL_APPOINTMENT_FAILURE,
    CANCEL_APPOINTMENT_REQUEST,
    CANCEL_APPOINTMENT_SUCCESS,
    FETCH_USER_APPOINTMENTS_REQUEST,
    FETCH_USER_APPOINTMENTS_SUCCESS,
    FETCH_USER_APPOINTMENTS_FAILURE,
    UPDATE_APPOINTMENT_REQUEST,
    UPDATE_APPOINTMENT_SUCCESS,
    UPDATE_APPOINTMENT_FAILURE,
} from '../constants/appointmentConstants';

export const fetchBookedSlots = (date, doctor) => {
    return async (dispatch) => {
        dispatch({ type: FETCH_BOOKED_SLOTS_REQUEST });

        // Log the doctor name
        console.log('Fetching booked slots for doctor:', doctor);

        try {
            const response = await fetch(`http://localhost:5000/api/bookedSlots?date=${date}&doctor=${doctor}`);
            const data = await response.json();

            if (response.ok) {
                dispatch({ type: FETCH_BOOKED_SLOTS_SUCCESS, payload: data.bookedSlots });
                return { success: true };
            } else {
                dispatch({ type: FETCH_BOOKED_SLOTS_FAILURE, payload: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            dispatch({ type: FETCH_BOOKED_SLOTS_FAILURE, payload: error.message });
            return { success: false, message: error.message };
        }
    };
};

// Book appointment
export const bookAppointment = (appointmentData) => {
    return async (dispatch) => {
        dispatch({ type: BOOK_APPOINTMENT_REQUEST });

        try {
            const response = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: BOOK_APPOINTMENT_SUCCESS, payload: data });
                return { success: true, message: 'Appointment booked successfully!' };
            } else {
                dispatch({ type: BOOK_APPOINTMENT_FAILURE, payload: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            dispatch({ type: BOOK_APPOINTMENT_FAILURE, payload: error.message });
            return { success: false, message: error.message };
        }
    };
};

// Fetch appointments for the doctor
export const fetchAppointments = (doctorName) => {
    console.log(doctorName);
    return async (dispatch) => {
        dispatch({ type: FETCH_APPOINTMENTS_REQUEST });

        try {
            const response = await fetch(`http://localhost:5000/api/fetchappointments?doctorName=${encodeURIComponent(doctorName)}`);

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: FETCH_APPOINTMENTS_SUCCESS, payload: data.appointments });
                console.log("data :",data.appointments)
                return { success: true };
            } else {
                dispatch({ type: FETCH_APPOINTMENTS_FAILURE, payload: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            dispatch({ type: FETCH_APPOINTMENTS_FAILURE, payload: error.message });
            return { success: false, message: error.message };
        }
    };
};

export const fetchUserAppointments = (userId) => {
    return async (dispatch) => {
        dispatch({ type: FETCH_USER_APPOINTMENTS_REQUEST });

        try {
            const response = await fetch(`http://localhost:5000/api/fetchuserappointments?userId=${encodeURIComponent(userId)}`);
            const data = await response.json();

            if (response.ok) {
                dispatch({ type: FETCH_USER_APPOINTMENTS_SUCCESS, payload: data.appointments });
                return { success: true };
            } else {
                dispatch({ type: FETCH_USER_APPOINTMENTS_FAILURE, payload: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            dispatch({ type: FETCH_USER_APPOINTMENTS_FAILURE, payload: error.message });
            return { success: false, message: error.message };
        }
    };
};

// Cancel appointment
// Cancel appointment
export const cancelAppointment = (appointmentId) => {
    return async (dispatch) => {
        dispatch({ type: CANCEL_APPOINTMENT_REQUEST });
        console.log("Cancelling appointment with ID:", appointmentId);

        try {
            const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'canceled' }), // Set the status to 'canceled'
            });

            const data = await response.json();
            console.log('Response status:', response.status);
            console.log('Response data:', data);

            if (response.ok) {
                dispatch({ type: CANCEL_APPOINTMENT_SUCCESS, payload: appointmentId });
                return { success: true, message: 'Appointment canceled successfully!' };
            } else {
                dispatch({ type: CANCEL_APPOINTMENT_FAILURE, payload: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error:', error);
            dispatch({ type: CANCEL_APPOINTMENT_FAILURE, payload: error.message });
            return { success: false, message: error.message };
        }
    };
};


// Update appointment
export const updateAppointment = (appointmentId, updatedData) => {
    console.log("heyy",updatedData)
    return async (dispatch) => {
        dispatch({ type: UPDATE_APPOINTMENT_REQUEST });

        try {
            const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: UPDATE_APPOINTMENT_SUCCESS, payload: data });
                return { success: true, message: 'Appointment updated successfully!' };
            } else {
                dispatch({ type: UPDATE_APPOINTMENT_FAILURE, payload: data.message });
                return { success: false, message: data.message };
            }
        } catch (error) {
            dispatch({ type: UPDATE_APPOINTMENT_FAILURE, payload: error.message });
            return { success: false, message: error.message };
        }
    };
};
