import {
  CHANNEL_MEMBER_REQUEST,
  CHANNEL_MEMBER_SUCCESS,
  CREATE_CHANNEL_REQUEST,
  CREATE_CHANNEL_SUCCESS,
  GET_CHANNELS_REQUEST,
  GET_CHANNELS_SUCCESS,
  JOIN_CHANNEL_REQUEST,
  JOIN_CHANNEL_SUCCESS,
  RESET_CREATE_CHANNEL,
} from '../constants';

export const joinChannelReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case JOIN_CHANNEL_REQUEST:
      return { ...state, loading: true };

    case JOIN_CHANNEL_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    default:
      return state;
  }
};

export const channelMembersReducer = (state = {}, action) => {
  switch (action.type) {
    case CHANNEL_MEMBER_REQUEST:
      return { ...state, loading: true };
    case CHANNEL_MEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        members: action.payload,
      };
    default:
      return state;
  }
};

export const createChannelReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case CREATE_CHANNEL_REQUEST:
      return { ...state, loading: true };
    case CREATE_CHANNEL_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    case RESET_CREATE_CHANNEL:
      return {
        ...state,
        success: false,
      };
    default:
      return state;
  }
};

export const getChannelsReducer = (state = { allChannels: [] }, action) => {
  switch (action.type) {
    case GET_CHANNELS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_CHANNELS_SUCCESS:
      return {
        ...state,
        loading: false,
        allChannels: action.payload,
      };
    default:
      return state;
  }
};
