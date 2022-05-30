var http = require('http');
var url = require('url');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    console.log('change test2');

    response.writeHead(200);
    response.end('main3');
});
app.listen(3000);