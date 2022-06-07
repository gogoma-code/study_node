const express = require('express');
const router = express.Router();

const login = require('../lib/login');

router.post('/login_process', (request, response) => {
    login.login_process(request, response);
});

router.get('/logout_process', (request, response) => {
    login.logout_process(request, response);
});

router.get('/', (request, response) => {    
    login.home(request, response);
});

module.exports = router;