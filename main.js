var http = require('http');
var fs = require('fs');
var url = require('url');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/') {
      let list = '<ul>';
      /*
      fs.readdir('./data', (err, filelist) => {
        filelist.forEach(f => {
          list += `<li><a href="/?id=${f}">${f}</a></li>`
        });
      });
      */
      var filelist = fs.readdirSync('./data');
      filelist.forEach(f => {
        list += `<li><a href="/?id=${f}">${f}</a></li>`
      });
      list += '</ul>';

      fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title ? title : 'Welcome'}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title ? title : 'Welcome'}</h2>
          <p>${description ? description : 'Hello, Node.js'}</p>
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template);
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }

});
app.listen(3000);