const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys').secretOrKey;

// load user model
const User = require('../models/User');

//load login input validation
const validateLoginInput = require('../validation/loginValidation');

const loginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then((user) => {
    //check is user exist
    if (!user) {
      errors.email = 'User not found, register yet?';
      return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(password, user.password).then((isMatched) => {
      if (isMatched) {
        //Matched

        //create jwt payload
        const payload = {
          id: user._id,
          email: user.email,
          name: user.name,
          profilePhoto: user.profileImage,
        };

        //sign token
        jwt.sign(payload, keys, { expiresIn: 3600 * 6 }, (err, token) => {
          res.json({
            success: true,
            token: `Bearer ${token}`,
          });
        });
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
};

const currentUser = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    profilePhoto: req.user.profileImage,
  });
};

// social sign in
const isSignedIn = async (req, res, next) => {
  // console.log(req.user.id);
  const user = await User.findOne({ socialID: req.user.id });
  req.user = user;
  const userDetails = {
    user: req.user,
    // userAccess: req.session.accessToken,
  };
  res.status(200).json(userDetails);
  next();
};

//social sign out
const isSignedOut = (req, res) => {
  req.session.destroy();
  req.logOut();
};

module.exports = {
  loginUser,
  currentUser,
  isSignedIn,
  isSignedOut,
};
