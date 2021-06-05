const express = require('express');

const router = express.Router();

const saveChatMsgs =
  require('../../controllers/channelController').saveChatMsgs;

const getChatMsgs = require('../../controllers/channelController').getChatMsgs;

// @Route Post api/chat-message/save-chat-messages/:id
// @Desc api to save chat messages to DB
router.post('/save-chat-messages/:title', saveChatMsgs);

// @Route Get api/chat-message/get-chat-messages/:channelName
// @Desc api to get chat messages to DB
router.get('/get-chat-messages', getChatMsgs);

module.exports = router;
