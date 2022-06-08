const cookie = require('cookie');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    let html = `
        <form action="/cookie" method="post">
            <p>
                <input type="text" name="c_val" value="" />
                <input type="submit" value="cookie" />
            </p>
        </form>
    `;
    res.send(html);
});

app.post('/cookie', (req, res) => {
    let post = req.body;

    res.cookie('c_val', post.c_val);
    res.cookie('c_val_domain_path', post.c_val, { domain: 'example.com', path: '/admin' });
    res.cookie('c_val_httpOnly', post.c_val, { httpOnly: true });
    res.cookie('c_val_maxAge', post.c_val, { maxAge: 900000 });
    res.cookie('c_val_secure', post.c_val, { secure: true });

    res.send('cookie test!');
});

app.get('/cookie_check', (req, res) => {
    console.log(req.headers.cookie);
    
    let html = '';
    let cookies = {};
    if (req.headers.cookie !== undefined) {
        cookies = cookie.parse(req.headers.cookie);
    }

    Object.keys(cookies).forEach((key) => {
        html += `<p>key: ${key}, value:${cookies[key]}</p>`
    });

    res.send(html);
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});