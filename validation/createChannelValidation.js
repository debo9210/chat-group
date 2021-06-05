const Validator = require('validator');
const isempty = require('./isEmpty');

module.exports = validateCreateChannelInput = (data) => {
  const errors = {};

  data.channelName = !isempty(data.channelName) ? data.channelName : '';
  data.channelDesc = !isempty(data.channelDesc) ? data.channelDesc : '';

  if (!Validator.isLength(data.channelName, { min: 3, max: 25 })) {
    errors.channelName = 'Channel name must be between 3 and 25 characters';
  }

  if (Validator.isEmpty(data.channelName)) {
    errors.channelName = 'Channel name is required!';
  }

  if (!Validator.isLength(data.channelDesc, { min: 20, max: 300 })) {
    errors.channelDesc =
      'Channel description must be between 20 amd 300 characters';
  }

  if (Validator.isEmpty(data.channelDesc)) {
    errors.channelDesc = 'Channel Description is required!';
  }

  return {
    errors,
    isValid: isempty(errors),
  };
};
