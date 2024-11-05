import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk'; // Corrected import
import userReducer from '../Reducers/userReducer'; // Ensure this path is correct
import appointmentReducer from '../Reducers/appointmentReducer'; // Import the appointment reducer
import registerReducer from '../Reducers/registerReducer'; // Import the register reducer
import doctorReducer from '../Reducers/doctorReducer'; // Import the doctor reducer

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  appointment: appointmentReducer, // Keep bookedSlots within appointment
  register: registerReducer, // Add the register reducer
  doctor: doctorReducer, // Add the doctor reducer
});

// Create the store with the combined reducers
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
