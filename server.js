const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const colors = require('colors');

const usersRoutes = require('./routes/api/users');
const imageUpload = require('./utils/imageUpload').router;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

app.get('/', (req, res) => {
  res.send('Welcome to chat group backend');
});

// use routes
app.use('/api/users', usersRoutes);
app.use('/user/profile-image', imageUpload);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running @port ${port}`.magenta);
});
