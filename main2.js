var http = require('http');
var url = require('url');
 
var app = http.createServer(function(request,response){
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');

    let _url = request.url;
    let pathname = url.parse(_url, true).pathname;
    let html = '';
    if(pathname === '/') {
        html = `
            <h2> 테스트 페이지 </h2>
        `;
    } 

    response.writeHead(200);
    response.end(html);
});

app.listen(3001);