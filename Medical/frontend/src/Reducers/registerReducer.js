// src/redux/registerReducer.js
import { REGISTER_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST } from '../constants/registerConstants';

const initialState = {
  user: null,
  error: null,
  loading: false, // Optional: to manage loading state
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      return { ...state, loading: true, error: null }; // Set loading to true
    case REGISTER_SUCCESS:
      return { ...state, user: action.payload, error: null, loading: false }; // On success, set user and reset loading
    case REGISTER_FAILURE:
      return { ...state, error: action.payload, loading: false }; // On failure, set error and reset loading
    default:
      return state;
  }
};

export default registerReducer;
