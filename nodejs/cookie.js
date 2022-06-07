const cookie = require('cookie');
const express = require('express');
const app = express();

app.get('/', (request, response) => {
    var cookies = {};
    if (request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie);
    }

    response.append('Set-Cookie', [
        'yummy_cookie=choco',
        'tasty_cookie=strawberry',
        `Permanent=cookies; Max-Age=${60 * 60 * 24 * 30}`,
        'Secure=Secure; Secure',
        'HttpOnly=HttpOnly; HttpOnly',
        'Path=Path; Path=/cookie',
        'Domain=Domain; Domain=o2.org',
    ]);
    response.send('Cookie!!');
});
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});