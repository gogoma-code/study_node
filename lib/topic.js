const qs = require('querystring');

const template = require('./template');
const db = require('./db');

exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.html(title, list
            , `<h2>${title}</h2>${description}`
            , `<a href="/create">create</a>`
        );

        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function (request, response, queryData) {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if (err) throw err;

        db.query(`SELECT topic.*, author.name FROM topic LEFT JOIN author ON (topic.author_id=author.id) WHERE topic.id=?`, [queryData.id], (err2, topic) => {
            if (err2) throw err2;

            var title = topic[0].title
            var description = topic[0].description
            var list = template.list(topics);
            var html = template.html(title, list
                , `<h2>${title}</h2>${description} <p>by ${topic[0].name}</p>`
                , ` <a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a> 
                <form action="/delete_process" method="post" onsubmit="return confirm('${title}을 삭제하시겠습니까?');">
                  <input type="hidden" name="id" value="${queryData.id}" />
                  <input type="submit" value="delete" />
                </form>
              `
            );

            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create = function (request, response) {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if (err) throw err;

        db.query(`SELECT * FROM author`, (err2, authros) => {
            if (err2) throw err2;

            var title = 'Create';
            var list = template.list(topics);
            var html = template.html(title, list,
                ` <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authros)}
              </p>
              <p>
                <input type="submit">
              </p>
              </form>
            `,
                `<a href="/create">create</a>`
            );

            response.writeHead(200);
            response.end(html);
        })
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
        INSERT INTO topic (title, description, created, author_id) 
        VALUES (?, ?, NOW(), ?)
        `,
            [post.title, post.description, post.author],
            (err, results) => {
                if (err) throw err;

                response.writeHead(302, { Location: `/?id=${results.insertId}` });
                response.end();
            }
        );
    });
}

exports.update = function (request, response, queryData) {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if (err) throw err;

        db.query(`SELECT topic.*, author.name FROM topic LEFT JOIN author ON (topic.author_id=author.id) WHERE topic.id=?`, [queryData.id], (err2, topic) => {
            if (err2) throw err2;

            db.query(`SELECT * FROM author`, (err2, authros) => {
                console.log(topic);
                var id = topic[0].id
                var title = topic[0].title
                var description = topic[0].description
                var list = template.list(topics);
                var html = template.html(title, list,
                    ` <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${id}" />
                  <p><input type="text" name="title" placeholder="title" value="${title}" /></p>
                  <p>
                      <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  <p>
                    ${template.authorSelect(authros, topic[0].author_id)}
                  </p>
                  <p>
                      <input type="submit" />
                  </p>
                </form>`,
                    ` <a href="/create">create</a>
                <a href="/update?id=${id}">update</a>
                <form action="/delete_process" method="post" onsubmit="return confirm('${title}을 삭제하시겠습니까?');">
                  <input type="hidden" name="id" value="${id}" />
                  <input type="submit" value="delete" />
                </form>`
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
        console.log(post);

        db.query(`
        UPDATE topic 
        SET title=?, description=?, author_id=?
        WHERE id=? `,
            [post.title, post.description, post.author, post.id],
            (err, results) => {
                if (err) throw err;

                response.writeHead(302, { Location: `/?id=${post.id}` });
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

        db.query(`DELETE FROM topic WHERE id=?`, [post.id], (err) => {
            if (err) throw err;

            response.writeHead(302, { Location: `/` });
            response.end();
        });
    });
}