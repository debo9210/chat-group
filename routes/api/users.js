const express = require('express');
const passport = require('passport');

const router = express.Router();

const registerUser = require('../../controllers/usersRegister');
const loginUser = require('../../controllers/usersLogin').loginUser;
const currentUser = require('../../controllers/usersLogin').currentUser;
// @Route POST api/users/register
// @Desc route to register users
// @Access Public
router.post('/register', registerUser);

// @Route Post api/users/login
// @Desc route to login user / return jwt token
// @Access Public
router.post('/login', loginUser);

// @Route GET api/users/current
// @Desc Return current user route
// @Access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  currentUser
);

module.exports = router;
