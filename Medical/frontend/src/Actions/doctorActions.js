import { 
    FETCH_DOCTOR_PROFILE_REQUEST, 
    FETCH_DOCTOR_PROFILE_SUCCESS, 
    FETCH_DOCTOR_PROFILE_FAILURE, 
    UPDATE_PROFILE_PICTURE_REQUEST, 
    UPDATE_PROFILE_PICTURE_SUCCESS, 
    UPDATE_PROFILE_PICTURE_FAILURE 
  } from '../constants/doctorConstants.js';
  
  export const fetchDoctorProfile = (doctorId) => {
    return async (dispatch) => {
      dispatch({ type: FETCH_DOCTOR_PROFILE_REQUEST });
  
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}`);
        const data = await response.json();
  
        if (response.ok) {
          dispatch({ type: FETCH_DOCTOR_PROFILE_SUCCESS, payload: data });
        } else {
          console.error('Fetch doctor profile failed:', data.message);
          dispatch({ type: FETCH_DOCTOR_PROFILE_FAILURE, payload: data.message });
        }
      } catch (error) {
        console.error('Fetch doctor profile error:', error.message);
        dispatch({ type: FETCH_DOCTOR_PROFILE_FAILURE, payload: error.message });
      }
    };
  };
  
  export const updateProfilePicture = (doctorId, formData) => {
    console.log("heyyy",doctorId,formData);
    return async (dispatch) => {
      dispatch({ type: UPDATE_PROFILE_PICTURE_REQUEST });
  
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}/photo`, {
          method: 'POST',
          body: formData,
        });
  
        const contentType = response.headers.get('content-type');
        console.log('Response Content-Type:', contentType);
  
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: UPDATE_PROFILE_PICTURE_SUCCESS, payload: data });
          dispatch(fetchDoctorProfile(doctorId)); // Refresh the profile
        } else {
          const errorText = await response.text();
          console.error('Update profile picture failed:', errorText);
          dispatch({ type: UPDATE_PROFILE_PICTURE_FAILURE, payload: errorText });
        }
      } catch (error) {
        console.error('Update profile picture error:', error.message);
        dispatch({ type: UPDATE_PROFILE_PICTURE_FAILURE, payload: error.message });
      }
    };
  };
  