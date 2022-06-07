const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// document.cookie to json
var cookies = {};
document.cookie.split(/\s*;\s*/).forEach(function(pair) {
  pair = pair.split(/\s*=\s*/);
  cookies[pair[0]] = pair.splice(1).join('=');
});

const socket = io();

const {username, room } = cookies;

// Join chatroom
socket.emit('joinRoom', { username, room });

