import {
  GET_CHAT_MESSAGES_REQUEST,
  GET_CHAT_MESSAGES_SUCCESS,
  GET_ERRORS,
  SAVE_CHAT_MESSAGES_REQUEST,
  SAVE_CHAT_MESSAGES_SUCCESS,
} from '../constants';
import { clearErrors } from './authAction';
import axios from 'axios';

export const saveChatMessages = (title, msgObj) => async (dispatch) => {
  try {
    dispatch(clearErrors());

    dispatch({ type: SAVE_CHAT_MESSAGES_REQUEST });

    await axios.post(`/api/chat-message/save-chat-messages/${title}`, msgObj);
    dispatch({
      type: SAVE_CHAT_MESSAGES_SUCCESS,
      payload: true,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    });
  }

  // console.log(title, msgArray);
};

export const getChatMessages = () => async (dispatch) => {
  try {
    dispatch(clearErrors());
    dispatch({ type: GET_CHAT_MESSAGES_REQUEST });

    const { data } = await axios.get(`/api/chat-message/get-chat-messages`);

    dispatch({
      type: GET_CHAT_MESSAGES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data,
    });
  }
};
