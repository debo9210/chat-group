// load user model
const User = require('../models/User');

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

module.exports = {
  joinChannel,
  channelMembers,
};
