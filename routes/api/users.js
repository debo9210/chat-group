const express = require('express');
const passport = require('passport');

const router = express.Router();

const registerUser = require('../../controllers/usersRegister');
const loginUser = require('../../controllers/usersLogin').loginUser;
const currentUser = require('../../controllers/usersLogin').currentUser;

const updateOnlineStatus = require('../../controllers/usersLogin')
  .updateOnlineStatus;

const joinChannel = require('../../controllers/channelController').joinChannel;
const channelMembers = require('../../controllers/channelController')
  .channelMembers;

const createChannel = require('../../controllers/channelController')
  .createChannel;

const getChannels = require('../../controllers/channelController').getChannels;

// @Route POST api/users/register
// @Desc route to register users
// @Access Public
router.post('/register', registerUser);

// @Route Post api/users/login
// @Desc route to login user / return jwt token
// @Access Public
router.post('/login', loginUser);

// @Route PUT api/users/update-online-status/:id
// @Desc route to update user online status
// @Access Public
router.post('/update-online-status/:id', updateOnlineStatus);

// @Route POST api/users/join-channel
// @Desc api for users to join channel
router.post('/join-channel', joinChannel);

// @Route GET api/users/channel-members
// @Desc api to get channel members
router.get('/channel-members', channelMembers);

// @Route POST api/users/join-channel
// @Desc api for users to join channel
router.post('/create-channel', createChannel);

// @Route Get api/users/get-channels
// @Desc api to get channels
router.get('/get-channels', getChannels);

// @Route GET api/users/current
// @Desc Return current user route
// @Access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  currentUser
);

module.exports = router;
