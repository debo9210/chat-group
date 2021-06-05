const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatChannelSchema = new Schema({
  // createdBy: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'user',
  // },
  channelName: {
    type: String,
    require: true,
  },
  channelDesc: {
    type: String,
    require: true,
  },
  chatMessages: [
    {
      chatMonth: {
        type: String,
      },
      messagesArray: {
        type: Array,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = ChatChannel = mongoose.model(
  'chatChannels',
  ChatChannelSchema
);
