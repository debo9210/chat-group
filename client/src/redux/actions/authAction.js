import {
  CLEAR_ERRORS,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  GET_ERRORS,
  SET_CURRENT_USER,
} from '../constants';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../../utils/setAuthToken';

//register user
export const registerUser = (formData) => (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  dispatch(clearErrors());

  dispatch({ type: CREATE_USER_REQUEST });

  axios
    .post('/api/users/register', formData, config)
    .then(() =>
      dispatch({
        type: CREATE_USER_SUCCESS,
        payload: true,
      })
    )
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//log in user
export const loginUser = (userData) => (dispatch) => {
  dispatch(clearErrors());

  axios
    .post('/api/users/login', userData)
    .then((res) => {
      // set token to local storage
      const { token } = res.data;
      localStorage.setItem('jwtToken', JSON.stringify(token));

      //set auth token to auth headers
      setAuthToken(token);

      //decode auth token to get user data
      const decoded = jwt_decode(token);

      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// export const socialConnection = () => (dispatch) => {
//   dispatch({
//     type: SOCIAL_USER,
//     payload: 'not connected',
//   });
// };

// log out user
export const logoutUser = (id) => (dispatch) => {
  axios.post(`/api/users/update-online-status/${id}`);
  // remove token from local storage
  localStorage.removeItem('jwtToken');
  //remove auth header for future request
  setAuthToken(false);
  //set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
