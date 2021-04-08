const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const colors = require('colors');

const usersRoutes = require('./routes/api/users');
const socialAuthRoutes = require('./routes/api/socialAuth');
const imageUpload = require('./utils/imageUpload').router;

const app = express();

//database connection
const DB = require('./config/keys').mongoURI;
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connected to database'.random))
  .catch((err) => console.log(err));

//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//express session middleware
app.use(
  session({
    secret: require('./config/keys').secretOrKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    store: MongoStore.create({
      mongoUrl: DB,
      collectionName: 'sessions',
    }),
  })
);

//passport middleware
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

//passport config
require('./config/passport')(passport);

app.get('/', (req, res) => {
  res.send('Welcome to chat group backend');
});

// use routes
app.use('/api/users', usersRoutes);
app.use('/auth', socialAuthRoutes);
app.use('/user/profile-image', imageUpload);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running @port ${port}`.magenta);
});
