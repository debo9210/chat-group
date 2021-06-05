const bycrypt = require('bcryptjs');
const multer = require('multer');

// load user model
const User = require('../models/User');

//image upload functionality
const upload = require('../utils/imageUpload').upload;

// load inputs validation
const validateRegisterInput = require('../validation/registerValidation');

const registerUser = (req, res) => {
  upload(req, res, function (err) {
    // console.log(req.body);
    const { errors, isValid } = validateRegisterInput(req.body);
    if (err instanceof multer.MulterError) {
      // An error occurred when uploading
      //   return;
      if (err.code) {
        errors.imageUpload = 'File too large! max 3mb.';
        return res.status(400).json(errors);
      }
    } else if (err) {
      errors.imageUpload = `${err.message}! Image with only .png, .gif, .jpg and .jpeg format allowed!`;
      return res.status(400).json(errors);
    }

    // Everything went fine

    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let profileImage;
    const url = req.protocol + '://' + req.get('host');
    if (!req.file) {
      profileImage = null;
    } else {
      profileImage = `${url}/user/profile-image/${req.file.filename}`;
    }

    //check is user exists by email
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        errors.email = 'User with this email already exists';
        return res.status(400).json(errors);
      } else {
        //create user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          profileImage: profileImage,
          channelJoined: ['welcome'],
          onlineStatus: false,
        });

        // hash user password and save to database
        bycrypt.genSalt(10, (err, salt) => {
          bycrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  });
};

module.exports = registerUser;
