const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: require('./keys').secretOrKey,
};

//social strateg credentials
const googleAuth = require('./keys').googleAuth;
const facebookAuth = require('./keys').facebookAuth;

//set credetianls for either dev or prod
let googleCred, facebookCred;
if (process.env.NODE_ENV === 'production') {
  googleCred = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://debo9210-auth-app.herokuapp.com/auth/google/callback',
  };

  facebookCred = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL:
      'https://debo9210-auth-app.herokuapp.com/auth/facebook/callback',
  };
} else {
  googleCred = {
    clientID: googleAuth.googleClientID,
    clientSecret: googleAuth.googleClientSecret,
    callbackURL: googleAuth.googleCallbackUrl,
  };
  facebookCred = {
    clientID: facebookAuth.facebookClientID,
    clientSecret: facebookAuth.facebookClientSecret,
    callbackURL: facebookAuth.facebookCallbackUrl,
  };
}

module.exports = (passport) => {
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleCred.clientID,
        clientSecret: googleCred.clientSecret,
        callbackURL: googleCred.callbackURL,
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        // req.session.accessToken = accessToken;
        User.findOne({ socialID: profile.id }).then((user) => {
          if (user) {
            //update user in the database
            const updateUser = {
              socialID: profile.id,
              name: profile.displayName,
              profileImage: profile.picture,
              email: profile.email,
              socialName: profile.provider,
            };

            User.findOneAndUpdate(
              { user: user._id },
              { $set: updateUser },
              { new: true }
            );
          } else {
            //create new user in database
            const newUser = new User({
              socialID: profile.id,
              name: profile.displayName,
              profileImage: profile.picture,
              email: profile.email,
              socialName: profile.provider,
            });
            newUser
              .save()
              .then((user) => done(null, user))
              .catch((err) => console.log(err));
          }
        });
        return done(null, profile);
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookCred.clientID,
        clientSecret: facebookCred.clientSecret,
        callbackURL: facebookCred.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email'],
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        // req.session.accessToken = accessToken;
        User.findOne({ socialID: profile.id }).then((user) => {
          if (user) {
            //update user in database
            const updateUser = {
              socialID: profile.id,
              name: profile.displayName,
              profileImage: profile.photos[0].value,
              email: profile.emails[0].value,
              socialName: profile.provider,
            };

            User.findOneAndUpdate(
              { user: user._id },
              { $set: updateUser },
              { new: true }
            );
            // console.log(user.socialID);
          } else {
            //create new user in database
            const newUser = new User({
              socialID: profile.id,
              name: profile.displayName,
              profileImage: profile.photos[0].value,
              email: profile.emails[0].value,
              socialName: profile.provider,
            });
            newUser
              .save()
              .then((user) => done(null, user))
              .catch((err) => console.log(err));
          }
        });
        return done(null, profile);
      }
    )
  );
};
