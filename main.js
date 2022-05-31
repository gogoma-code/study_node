const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const mysql = require('mysql');

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'yk2201',
  database : 'opentutorials'
});
db.connect();

var app = http.createServer((request, response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    var filelist = fs.readdirSync('./data');
    if (queryData.id === undefined) {
      /* fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.html(title, list
          , `<h2>${title}</h2>${description}`
          , `<a href="/create">create</a>`
        );

        response.writeHead(200);
        response.end(html);
      }); */
      db.query(`SELECT * FROM topic`, (error, topics) => {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.html(title, list
          , `<h2>${title}</h2>${description}`
          , `<a href="/create">create</a>`
        );

        response.writeHead(200);
        response.end(html);
      });
    } else {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        var title = queryData.id;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags: ['h2'],
        });
        var list = template.list(filelist);
        var html = template.html(sanitizedTitle, list
          , `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
          , ` <a href="/create">create</a> 
              <a href="/update?id=${sanitizedTitle}">update</a> 
              <form action="/delete_process" method="post" onsubmit="return confirm('${sanitizedTitle}을 삭제하시겠습니까?');">
                <input type="hidden" name="id" value="${sanitizedTitle}" />
                <input type="submit" value="delete" />
              </form>
            `
        );

        response.writeHead(200);
        response.end(html);
      });
    }
  } else if (pathname === '/create') {
    var filelist = fs.readdirSync('./data');
    var title = 'Welcome';
    var list = template.list(filelist);
    var html = template.html(title, list
      , `<form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
              <input type="submit">
          </p>
      </form>`
      , ''
    );

    response.writeHead(200);
    response.end(html);
  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;

      fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathname === '/update') {
    var filelist = fs.readdirSync('./data');
    var filteredId = path.parse(queryData.id).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      var title = queryData.id;
      var list = template.list(filelist);
      var html = template.html(title, list
        , `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}" />
            <p><input type="text" name="title" placeholder="title" value="${title}" /></p>
            <p>
                <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
                <input type="submit" />
            </p>
        </form>`
        , ` <a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <form action="/delete_process" method="post" onsubmit="return confirm('${title}을 삭제하시겠습니까?');">
              <input type="hidden" name="id" value="${title}" />
              <input type="submit" value="delete" />
            </form>
          `
      );

      response.writeHead(200);
      response.end(html);
    });
  } else if(pathname === '/update_process') {
    var body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      
      fs.rename(`data/${id}`, `data/${title}`, (err) => {
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      })
    });
  } else if(pathname === '/delete_process') {
    var body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      var post = qs.parse(body);
      var id = post.id;
      
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, (err) => {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);