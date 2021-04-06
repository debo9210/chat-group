const Validator = require('validator');
const isempty = require('./isEmpty');

module.exports = validateRegisterInput = (data) => {
  let errors = {};

  data.name = !isempty(data.name) ? data.name : '';
  data.email = !isempty(data.email) ? data.email : '';
  data.password = !isempty(data.password) ? data.password : '';
  data.confirmPassword = !isempty(data.confirmPassword)
    ? data.confirmPassword
    : '';

  if (!Validator.isLength(data.name, { min: 2, max: 20 })) {
    errors.name = 'Name must be between 2 and 20 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm password field is required';
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Password must be identical';
  }

  return {
    errors,
    isValid: isempty(errors),
  };
};
