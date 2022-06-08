const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const botName = "YK-CHAT";

const helmet = require('helmet');
app.use(helmet());

app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const topic = require('./lib/topic');
const chat = require('./lib/chat');
const topicRouter = require('./routes/topic');
const authorRouter = require('./routes/author');
const loginRouter = require('./routes/login');
const chatRouter = require('./routes/chat');

app.use(express.static('public')); // public 안에서 찾겠다.
app.use(express.urlencoded({ extended: false }));

// 미들웨어 만들기
app.use((request, response, next) => {
  fs.readdir('./data', (err, filelist) => {
    request.filelist = filelist;
    next();
  })
});

app.use('/chat', chatRouter);
app.use('/topic', topicRouter);
app.use('/author', authorRouter);
app.use('/login', loginRouter);

app.get('/', (request, response) => {
  topic.home(request, response);
});

app.use((request, response, next) => {
  response.status(404).send('<h1> ::404 ERROR:: 요청 페이지 없음 </h1>');
});

app.use((error, request, response, next) => {
  console.error(error.stack);
  response.status(500).send('<h1> ::500 ERROR:: </h1>');
});

io.on('connection', (socket) => {  
  socket.on('joinRoom', ({ username, room }) => {
    
    const user = chat.userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit('message', chat.formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit (
        'message',
        chat.formatMessage(botName, `${user.username} has joined the chat`)
      );
    
    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: chat.getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = chat.getCurrentUser(socket.id);

    io.to(user.room).emit('message', chat.formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = chat.userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        chat.formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: chat.getRoomUsers(user.room)
      });
    }
  });
});

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});