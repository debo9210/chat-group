import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { errorsReducer } from './redux/reducers/errorReducer';
import {
  registerUserReducer,
  currentUserReducer,
} from './redux/reducers/authReducers';
import {
  joinChannelReducer,
  channelMembersReducer,
  createChannelReducer,
  getChannelsReducer,
} from './redux/reducers/channelReducer';

import {
  saveChatMessageReducer,
  getChatMessageReducer,
} from './redux/reducers/chatMessagesReducer';

const reducers = combineReducers({
  errorsObj: errorsReducer,
  registerUser: registerUserReducer,
  currentUser: currentUserReducer,
  joinChannel: joinChannelReducer,
  channelMembers: channelMembersReducer,
  createChannel: createChannelReducer,
  getChannels: getChannelsReducer,
  saveChatMessages: saveChatMessageReducer,
  chatMessagesArray: getChatMessageReducer,
});

const initialState = {};

const middleware = [thunk];

const devTools =
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(...middleware)
    : composeWithDevTools(applyMiddleware(...middleware));

const store = createStore(reducers, initialState, devTools);

export default store;
