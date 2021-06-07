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

        //update user online status
        // User.findOneAndUpdate({ email }, { onlineStatus: true }, { new: true });

        user.onlineStatus = true;
        user.save();

        //create jwt payload
        const payload = {
          id: user._id,
          email: user.email,
          name: user.name,
          profilePhoto: user.profileImage,
          onlineStatus: user.onlineStatus,
          channelJoined: user.channelJoined,
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

const updateOnlineStatus = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        user.onlineStatus = false;
        user.save();
      }
    })
    .catch((err) => console.log(err));
};

const currentUser = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    profilePhoto: req.user.profileImage,
  });
};

module.exports = {
  loginUser,
  currentUser,
  updateOnlineStatus,
};
