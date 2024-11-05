import {
    BOOK_APPOINTMENT_REQUEST,
    BOOK_APPOINTMENT_SUCCESS,
    BOOK_APPOINTMENT_FAILURE,
    FETCH_BOOKED_SLOTS_REQUEST,
    FETCH_BOOKED_SLOTS_SUCCESS,
    FETCH_BOOKED_SLOTS_FAILURE,
    FETCH_APPOINTMENTS_REQUEST,
    FETCH_APPOINTMENTS_SUCCESS,
    FETCH_APPOINTMENTS_FAILURE,
    CANCEL_APPOINTMENT_REQUEST,
    CANCEL_APPOINTMENT_SUCCESS,
    CANCEL_APPOINTMENT_FAILURE,
    FETCH_USER_APPOINTMENTS_REQUEST,
    FETCH_USER_APPOINTMENTS_SUCCESS,
    FETCH_USER_APPOINTMENTS_FAILURE,
    UPDATE_APPOINTMENT_REQUEST,
    UPDATE_APPOINTMENT_SUCCESS,
    UPDATE_APPOINTMENT_FAILURE,
} from '../constants/appointmentConstants';

const initialState = {
    loading: false,
    appointment: null,
    bookedSlots: [],
    appointments: [], // Add appointments to the state
    error: null,
};

const appointmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case BOOK_APPOINTMENT_REQUEST:
            return { ...state, loading: true, error: null };
        case BOOK_APPOINTMENT_SUCCESS:
            return { ...state, loading: false, appointment: action.payload };
        case BOOK_APPOINTMENT_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case FETCH_BOOKED_SLOTS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_BOOKED_SLOTS_SUCCESS:
            return { ...state, loading: false, bookedSlots: action.payload };
        case FETCH_BOOKED_SLOTS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case FETCH_APPOINTMENTS_REQUEST:
            return { ...state, loading: true, error: null }; // Handle loading state for fetching appointments
        case FETCH_APPOINTMENTS_SUCCESS:
            return { ...state, loading: false, appointments: action.payload }; // Update appointments
        case FETCH_APPOINTMENTS_FAILURE:
            return { ...state, loading: false, error: action.payload }; // Handle error for fetching appointments
        case FETCH_USER_APPOINTMENTS_REQUEST:
            return { ...state, loading: true, error: null }; // Handle loading state for fetching user appointments
        case FETCH_USER_APPOINTMENTS_SUCCESS:
            return { ...state, loading: false, appointments: action.payload }; // Update appointments with user-specific data
        case FETCH_USER_APPOINTMENTS_FAILURE:
            return { ...state, loading: false, error: action.payload }; // Handle error for fetching user appointments
        case CANCEL_APPOINTMENT_REQUEST:
            return { ...state, loading: true, error: null }; // Handle loading state for canceling appointment
        case CANCEL_APPOINTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                appointments: state.appointments.filter(appointment => appointment.id !== action.payload),
            }; // Remove the canceled appointment from the state
        case CANCEL_APPOINTMENT_FAILURE:
            return { ...state, loading: false, error: action.payload }; // Handle error for canceling appointment
        case UPDATE_APPOINTMENT_REQUEST:
            return { ...state, loading: true, error: null }; // Handle loading state for updating appointment
        case UPDATE_APPOINTMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                appointments: state.appointments.map(appointment =>
                    appointment.id === action.payload.id ? action.payload : appointment
                ),
            }; // Update the appointment in the state
        case UPDATE_APPOINTMENT_FAILURE:
            return { ...state, loading: false, error: action.payload }; // Handle error for updating appointment
        default:
            return state;
    }
};

export default appointmentReducer;
