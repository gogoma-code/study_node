const common = require('./common');
const template = require('./template');
const db = require('./db');

exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if (err) throw err;

        db.query(`SELECT * FROM author`, (err2, authros) => {
            if (err2) throw err2;

            var title = 'author';
            var list = template.list(topics);
            var html = template.html(title, list,
                `
                ${template.authorTable(authros)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td {
                        border:1px solid black;
                    }
                </style>
                <form action="/login/login_process" method="post">
                    <p><input type="text" name="email" placeholder="email"></p>
                    <p><input type="password" name="password" placeholder="password"></p>
                    <p><input type="submit" value="login"></p>
                </form>
                `,
                ``,
                common.authIsOwner(request, response)
            );

            response.send(html);
        });
    });
}

exports.login_process = function (request, response) {
    var post = request.body

    if (post.email === 'yongki' && post.password === '1111') {
        response.cookie('email', post.email);
        response.cookie('password', post.password);
        response.cookie('nickname', 'yongki');

        response.redirect('/');
    } else {
        response.send('Who?');
    }
}

exports.logout_process = function (request, response) {
    var post = request.body

    response.clearCookie('email');
    response.clearCookie('password');
    response.clearCookie('nickname');

    response.redirect('/');
}