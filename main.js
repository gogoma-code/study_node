const fs = require('fs');
const express = require('express');
const app = express();

const helmet = require('helmet');
app.use(helmet());

const topic = require('./lib/topic');

const topicRouter = require('./routes/topic');
const authorRouter = require('./routes/author');
const loginRouter = require('./routes/login');

app.use(express.static('public')); // public 안에서 찾겠다.
app.use(express.urlencoded({ extended: false }));

// 미들웨어 만들기
app.use((request, response, next) => {
  fs.readdir('./data', (err, filelist) => {
    request.filelist = filelist;
    next();
  })
});

app.use('/login', loginRouter);
app.use('/topic', topicRouter);
app.use('/author', authorRouter);

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

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
