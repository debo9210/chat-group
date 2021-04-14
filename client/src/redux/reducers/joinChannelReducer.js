import {
  CHANNEL_MEMBER_REQUEST,
  CHANNEL_MEMBER_SUCCESS,
  JOIN_CHANNEL_REQUEST,
  JOIN_CHANNEL_SUCCESS,
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
