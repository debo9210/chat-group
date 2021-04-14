import {
  CHANNEL_MEMBER_REQUEST,
  CHANNEL_MEMBER_SUCCESS,
  CLEAR_ERRORS,
  GET_ERRORS,
  JOIN_CHANNEL_REQUEST,
  JOIN_CHANNEL_SUCCESS,
} from '../constants';
import axios from 'axios';

export const joinChannel = (userDetails) => (dispatch) => {
  dispatch(clearErrors());

  dispatch({ type: JOIN_CHANNEL_REQUEST });

  axios
    .post('/api/users/join-channel', userDetails)
    .then((res) => {
      //   console.log(res.data);
      dispatch({
        type: JOIN_CHANNEL_SUCCESS,
        payload: true,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getChannelMembers = () => async (dispatch) => {
  try {
    dispatch(clearErrors());
    dispatch({ type: CHANNEL_MEMBER_REQUEST });

    const { data } = await axios.get('/api/users/channel-members');

    dispatch({
      type: CHANNEL_MEMBER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data,
    });
  }
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
