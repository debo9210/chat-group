const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  password: {
    type: String,
  },
  socialID: {
    type: String,
  },
  socialName: {
    type: String,
  },
  onlineStatus: {
    type: Boolean,
  },
  channelJoined: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model('users', UserSchema);
