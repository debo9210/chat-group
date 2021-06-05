const express = require('express');
const passport = require('passport');
const router = express.Router();

const socialSignIn = require('../../controllers/usersLogin').isSignedIn;
const socialSignOut = require('../../controllers/usersLogin').isSignedOut;

let CLIENT_HOME_PAGE_URL, WELCOME_PAGE_URL;
if (process.env.NODE_ENV === 'production') {
  CLIENT_HOME_PAGE_URL = 'https://debo9210-chat-app.herokuapp.com/';
  WELCOME_PAGE_URL =
    'https://debo9210-chat-app.herokuapp.com/chat-portal/welcome';
} else {
  CLIENT_HOME_PAGE_URL = 'http://localhost:3000';
  WELCOME_PAGE_URL = `http://localhost:3000/chat-portal/welcome`;
}

//social login
router.get('/social-login', socialSignIn);

//social log out
router.delete('/social-logout', socialSignOut);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: CLIENT_HOME_PAGE_URL,
  }),
  (req, res) => {
    res.redirect(WELCOME_PAGE_URL);
  }
);

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: CLIENT_HOME_PAGE_URL,
    // successRedirect: SOCIAL_LOGIN_URL,
  }),
  (req, res) => {
    // res.json({ user: req.user.id });
    res.redirect(WELCOME_PAGE_URL);
  }
);

module.exports = router;
