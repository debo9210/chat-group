const moment = require('moment');

// load user model
const User = require('../models/User');

//load channel model
const ChatChannel = require('../models/ChatChannel');

//load chat messasges model
const ChatMessages = require('../models/ChatMessages');

//load channel input validation
const validateCreateChannelInput = require('../validation/createChannelValidation');
const { compareSync } = require('bcryptjs');
const { normalizeUnits } = require('moment');

// User.findOneAndUpdate(
//     { _id: req.body.id },
//     { $push: { channelJoined: req.body.channelName } }
//   )

const joinChannel = (req, res) => {
  User.findById(req.body.id)
    .then((user) => {
      if (user) {
        if (
          user.channelJoined.indexOf(req.body.channelName.toLowerCase()) === -1
        ) {
          user.channelJoined.unshift(req.body.channelName.toLowerCase());
        }
        user.save().then((user) => res.json(user));
      } else {
        return res.status(400).json({ errMsg: 'No user found' });
      }
    })
    .catch((err) => res.status(404).json(err.message));
};

const channelMembers = (req, res) => {
  User.find()
    .then((users) => {
      if (users) {
        return res.json(users);
      } else {
        return res.status(400).json({ errMsg: 'No user found' });
      }
    })
    .catch((err) => console.log(err));
};

const createChannel = (req, res) => {
  // console.log(req.body);
  const { errors, isValid } = validateCreateChannelInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //check if channel name exists
  ChatChannel.findOne({ channelName: req.body.channelName }).then((channel) => {
    if (channel) {
      errors.channelName = 'Channel already exist!! Name must be unique';
      return res.status(400).json(errors);
    } else {
      // create new channel
      const newChannel = new ChatChannel({
        channelName: req.body.channelName,
        channelDesc: req.body.channelDesc,
        // createdBy: req.body.userID,
      });

      newChannel
        .save()
        .then((channel) => res.json(channel))
        .catch((err) => console.log(err));
    }
  });

  // user who create channel join automatically....
  User.findById(req.body.userID)
    .then((user) => {
      if (user) {
        if (
          user.channelJoined.indexOf(req.body.channelName.toLowerCase()) === -1
        ) {
          user.channelJoined.unshift(req.body.channelName.toLowerCase());
        }
        user.save();
      }
    })
    .catch((err) => res.status(404).json(err.message));
};

// get channels
const getChannels = (req, res) => {
  ChatChannel.find()
    .then((channel) => {
      return res.json(channel);
    })
    .catch((err) => console.log(err));
};

// save chat messages
const saveChatMsgs = (req, res) => {
  // console.log(req.body.text);
  // console.log(req.params.title);

  ChatMessages.findOne({ chatDate: moment().format('MMMM DD YYYY') }).then(
    (chatMsg) => {
      if (!chatMsg) {
        const msgObj = {
          channelName: req.params.title,
          messagesArray: [req.body],
        };

        const newChatMsg = new ChatMessages({
          chatMessages: [msgObj],
          chatDate: moment().format('MMMM DD YYYY'),
        });

        newChatMsg
          .save()
          .then((msg) => res.json(msg))
          .catch((err) => res.json({ err: 'Something went wrong!!!' }));
      } else {
        chatMsg.chatMessages.filter((msg) => {
          if (msg.channelName === req.params.title) {
            msg.messagesArray.push(req.body);
          }
        });

        var newArray = chatMsg.chatMessages.filter(function (el) {
          return el.channelName === req.params.title;
        });

        if (newArray.length === 0) {
          // console.log(newArray);

          const msgObj = {
            channelName: req.params.title,
            messagesArray: [req.body],
          };
          chatMsg.chatMessages.push(msgObj);
        }

        chatMsg
          .save()
          .then((msg) => res.json(msg))
          .catch((err) => res.json({ err: 'Something went wrong!!!' }));
        // console.log(chatMsg);
      }
    }
  );
};

// get chat messages
const getChatMsgs = (req, res) => {
  // console.log(req.params.channelName);
  ChatMessages.find()
    .then((msgs) => {
      if (msgs) {
        return res.json(msgs);
      }
    })
    .catch((err) => console.log(err));
};

module.exports = {
  joinChannel,
  channelMembers,
  createChannel,
  getChannels,
  saveChatMsgs,
  getChatMsgs,
};
