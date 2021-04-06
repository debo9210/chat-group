const Validator = require('validator');
const isempty = require('./isEmpty');

module.exports = validateLoginInput = (data) => {
  const errors = {};

  data.email = !isempty(data.email) ? data.email : '';
  data.password = !isempty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isempty(errors),
  };
};
