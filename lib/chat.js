const path = require('path');

exports.home = function (request, response) {
    response.render('index1');
}

exports.inChat = function (request, response) {
    var post = request.body;
    response.cookie('username', post.username);
    response.cookie('room', post.room);

    response.render('chat');
}