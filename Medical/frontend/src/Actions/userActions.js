import { LOGIN_SUCCESS, LOGIN_FAILURE } from '../constants/userConstants';

export const loginUser = (email, password, role) => {
  return async (dispatch) => {
    try {
      // Log the data being sent
      console.log('Sending login data:', { email, password, role });

      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }), // Include role in the request body
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: LOGIN_SUCCESS, payload: data });
        return { success: true, ...data }; // Return success and user data
      } else {
        dispatch({ type: LOGIN_FAILURE, payload: data.message });
        return { success: false, message: data.message }; // Return failure
      }
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error.message });
      return { success: false, message: error.message }; // Return failure
    }
  };
};
