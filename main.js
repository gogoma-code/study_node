const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// socket.io
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const helmet = require('helmet');
app.use(helmet());

app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const topic = require('./lib/topic');
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
  console.log('connection in');
  
  socket.on('joinRoom', ({ username, room }) => {
    console.log('joinRoom in');
  });

  socket.on('disconnect', () => {
    console.log('disconnect in');
  });
});

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});