import { REGISTER_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST } from '../constants/registerConstants';

export const registerUser = (formData) => {
  return async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST }); // Dispatch REGISTER_REQUEST

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: formData, // Send FormData object
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: REGISTER_SUCCESS, payload: data });
        return { success: true, ...data }; // Return success and user data
      } else {
        dispatch({ type: REGISTER_FAILURE, payload: data.message });
        return { success: false, message: data.message }; // Return failure
      }
    } catch (error) {
      dispatch({ type: REGISTER_FAILURE, payload: error.message });
      return { success: false, message: error.message }; // Return failure
    }
  };
};
