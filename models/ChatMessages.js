const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatMessagesSchema = new Schema({
  chatMessages: [
    {
      channelName: {
        type: String,
      },
      messagesArray: {
        type: Array,
      },
    },
  ],
  chatDate: {
    type: String,
  },
});

module.exports = ChatMessages = mongoose.model(
  'chatMessages',
  ChatMessagesSchema
);
