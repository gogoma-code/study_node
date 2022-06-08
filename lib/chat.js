const moment = require('moment');
const users = [];

// chat main
exports.home = function (request, response) {
    response.render('index1');
}

// in chat
exports.inChat = function (request, response) {
    var post = request.body;
    response.cookie('username', post.username);
    response.cookie('room', post.room);

    response.render('chat');
}

// Join user to chat
exports.userJoin = function (id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get current user
exports.getCurrentUser = function (id) {
    return users.find(user => user.id === id);
}

// User leaves chat
exports.userLeave = function (id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
exports.getRoomUsers = function (room) {
    return users.filter(user => user.room === room);
}

exports.formatMessage = function (username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}
