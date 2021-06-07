const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const colors = require('colors');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');

const usersRoutes = require('./routes/api/users');
// const socialAuthRoutes = require('./routes/api/socialAuth');
const chatMessageRoutes = require('./routes/api/chatMessages');
const imageUpload = require('./utils/imageUpload').router;

const formatMessage = require('./utils/chatMsgs');
const { userJoin, getCurrentUser } = require('./utils/chatUsers');

// load chat channel model
const chatChannel = require('./models/ChatChannel');

const botName = 'ChatApp Bot';

const app = express();
const server = require('http').createServer(app);
// app.use(cors());
// const io = socketIO(server);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true,
  },
  allowEIO3: true,
});

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

// app.get('/', (req, res) => {
//   res.send('Welcome to chat group backend');
// });

// use routes
app.use('/api/users', usersRoutes);
app.use('/api/chat-message', chatMessageRoutes);
app.use('/user/profile-image', imageUpload);

//server static assets if in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running @port ${port}`.magenta);
});

//run when client connects
io.on('connection', (socket) => {
  // //listen for chat room and user
  socket.on('joinRoom', ({ username, channelName, userPhoto }) => {
    const user = userJoin(socket.id, username, channelName, userPhoto);

    socket.join(user.channelName);

    let welcomeMsg;
    // let welcomeMsg = `Welcome to ${user.channelName.toLowerCase()} channel`;
    if (user.channelName === 'welcome') {
      welcomeMsg = 'Welcome to ChatApp!!!';
    } else {
      welcomeMsg = `Welcome to ${user.channelName.toLowerCase()} channel`;
    }

    // welcome current user
    socket.emit('message', formatMessage(botName, welcomeMsg));

    //broacast msg when other users connect
    socket.broadcast
      .to(user.channelName)
      .emit(
        'message',
        formatMessage(botName, `${user.username} joined the chat`)
      );
  });

  //Listen for chat message
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    // console.log(user, 'user details');

    io.to(user.channelName).emit(
      'message',
      formatMessage(user.username, msg, user.userPhoto)
    );

    // console.log(formatMessage(user.username, msg, user.userPhoto))
  });

  // //broadcast when a user connects
  // socket.broadcast.emit('message', 'A user has joined the chat');

  //Runs when client disconnects
  socket.on('disconnect', () => {
    // console.log('disconnected')
    // send msg to everyone
    // console.log(user.channelName);
    io.emit('message', formatMessage(botName, 'A user left the chat'));
  });
});
