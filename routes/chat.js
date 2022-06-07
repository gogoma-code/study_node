const express = require('express');
const router = express.Router();

const chat = require('../lib/chat');

router.post('/inChat', (request, response) => {
    chat.inChat(request, response);
});

router.get('/', (request, response) => {
    chat.home(request, response);
});

module.exports = router;