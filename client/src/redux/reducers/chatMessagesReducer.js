import {
  GET_CHAT_MESSAGES_REQUEST,
  GET_CHAT_MESSAGES_SUCCESS,
  SAVE_CHAT_MESSAGES_REQUEST,
  SAVE_CHAT_MESSAGES_SUCCESS,
} from '../constants';

export const saveChatMessageReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case SAVE_CHAT_MESSAGES_REQUEST:
      return { ...state, loading: true };
    case SAVE_CHAT_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    default:
      return state;
  }
};

export const getChatMessageReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CHAT_MESSAGES_REQUEST:
      return { ...state, loading: true };
    case GET_CHAT_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        chatMsgArr: action.payload,
      };
    default:
      return state;
  }
};
