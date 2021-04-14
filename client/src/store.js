import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { errorsReducer } from './redux/reducers/errorReducer';
import {
  registerUserReducer,
  currentUserReducer,
  socialLoginReducer,
} from './redux/reducers/authReducers';
import {
  joinChannelReducer,
  channelMembersReducer,
} from './redux/reducers/joinChannelReducer';

const reducers = combineReducers({
  errorsObj: errorsReducer,
  registerUser: registerUserReducer,
  currentUser: currentUserReducer,
  socialConnect: socialLoginReducer,
  joinChannel: joinChannelReducer,
  channelMembers: channelMembersReducer,
});

const initialState = {};

const middleware = [thunk];

const devTools =
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(...middleware)
    : composeWithDevTools(applyMiddleware(...middleware));

const store = createStore(reducers, initialState, devTools);

export default store;
