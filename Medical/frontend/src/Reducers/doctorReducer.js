import { FETCH_DOCTOR_PROFILE_REQUEST, FETCH_DOCTOR_PROFILE_SUCCESS, FETCH_DOCTOR_PROFILE_FAILURE, UPDATE_PROFILE_PICTURE_REQUEST, UPDATE_PROFILE_PICTURE_SUCCESS, UPDATE_PROFILE_PICTURE_FAILURE } from '../constants/doctorConstants.js';

const initialState = {
  doctor: null,
  loading: false,
  error: null,
};

const doctorReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DOCTOR_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_DOCTOR_PROFILE_SUCCESS:
      return { ...state, doctor: action.payload, loading: false, error: null };
    case FETCH_DOCTOR_PROFILE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_PROFILE_PICTURE_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_PROFILE_PICTURE_SUCCESS:
      return { ...state, doctor: { ...state.doctor, profile_image: action.payload.profile_image }, loading: false, error: null };
    case UPDATE_PROFILE_PICTURE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default doctorReducer;
