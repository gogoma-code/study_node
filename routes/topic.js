const express = require('express');
const router = express.Router();

const topic = require('../lib/topic');

router.get('/create', (request, response) => {
    topic.create(request, response);
});

router.post('/create_process', (request, response) => {
    topic.create_process(request, response);
});

router.get('/update/:id', (request, response) => {
    topic.update(request, response)
});

router.post('/update_process', (request, response) => {
    topic.update_process(request, response);
});

router.post('/delete_process', (request, response) => {
    topic.delete_process(request, response);
});

router.get('/:id', (request, response, next) => {
    topic.page(request, response, next);
});

module.exports = router;