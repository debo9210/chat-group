import {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  SET_CURRENT_USER,
} from '../constants';
import { isEmpty } from '../../validation/isEmpty';

const initialState = {
  isAuthenticated: false,
  user: {},
};

const successState = {
  success: false,
};

export const registerUserReducer = (state = successState, action) => {
  switch (action.type) {
    case CREATE_USER_REQUEST:
      return { loading: true, ...state };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    default:
      return state;
  }
};

export const currentUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    default:
      return state;
  }
};
