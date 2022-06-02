const qs = require('querystring');

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
                <form action="/author/create_process" method="post">
                    <p><input type="text" name="name" placeholder="name"></p>
                    <p><textarea name="profile" placeholder="profile"></textarea></p>
                    <p><input type="submit" value="create" /></p>
                </form>
                `,
                ``
            );

            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function (request, response) {
    var body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        var post = qs.parse(body);

        db.query(` 
        INSERT INTO author (name, profile) 
        VALUES (?, ?)
        `,
            [post.name, post.profile],
            (err, results) => {
                if (err) throw err;

                response.writeHead(302, { Location: `/author` });
                response.end();
            }
        );
    });
}

exports.update = function (request, response, queryData) {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if (err) throw err;
        
        db.query(`SELECT * FROM author`, (err2, authros) => {
            if (err2) throw err2;
            
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], (err, author) => {
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
                    <form action="/author/update_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}" />
                        <p><input type="text" name="name" placeholder="name" value="${author[0].name}"/></p>
                        <p><textarea name="profile" placeholder="profile">${author[0].profile}</textarea></p>
                        <p><input type="submit" value="update" /></p>
                    </form>
                    `,
                    ``
                );

                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_process = function (request, response) {
    var body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        var post = qs.parse(body);

        db.query(`
        UPDATE author 
        SET name=?, profile=?
        WHERE id=? `,
            [post.name, post.profile, post.id],
            (err, results) => {
                if (err) throw err;

                response.writeHead(302, { Location: `/author` });
                response.end();
            }
        );
    });
}

exports.delete_process = function (request, response) {
    var body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        var post = qs.parse(body);

        db.query(`DELETE FROM author WHERE id=?`, [post.id], (err) => {
            if (err) throw err;

            response.writeHead(302, { Location: `/author` });
            response.end();
        });
    });
}