const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

const template = require('./template');
const db = require('./db');

exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.html(title, list,
            `
            <h2>${title}</h2>${description}
            <img src="/images/hello.jpg" style="width:30%; display:block; margin-top:20px;" />
            `,
            `<a href="/topic/create">create</a>`
        );

        response.send(html);
    });
}

exports.page = function (request, response, next) {
    let params = request.params;
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if (err) throw err;

        db.query(`SELECT topic.*, author.name FROM topic LEFT JOIN author ON (topic.author_id=author.id) WHERE topic.id=?`, [params.id], (err2, topic) => {
            if (err2) throw err2;
            else if (!topic.length) next();

            var title = topic[0].title
            var description = topic[0].description
            var list = template.list(topics);
            var html = template.html(title, list
                , `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)} <p>by ${sanitizeHtml(topic[0].name)}</p>`
                , ` <a href="/topic/create">create</a>
                    <a href="/topic/update/${params.id}">update</a> 
                    <form action="/topic/delete_process" method="post" onsubmit="return confirm('${sanitizeHtml(title)}을 삭제하시겠습니까?');">
                        <input type="hidden" name="id" value="${params.id}" />
                        <input type="submit" value="delete" />
                    </form>
                `
            );

            response.send(html);
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
                `   <form action="/topic/create_process" method="post">
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
                `<a href="/topic/create">create</a>`
            );

            response.send(html);
        })
    });
}

exports.create_process = function (request, response) {
    var post = request.body;

    db.query(` 
    INSERT INTO topic (title, description, created, author_id) 
    VALUES (?, ?, NOW(), ?)
    `,
        [post.title, post.description, post.author],
        (err, results) => {
            if (err) throw err;

            response.redirect(`/topic/${results.insertId}`);
        }
    );
}

exports.update = function (request, response) {
    let params = request.params;
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if (err) throw err;

        db.query(`SELECT topic.*, author.name FROM topic LEFT JOIN author ON (topic.author_id=author.id) WHERE topic.id=?`, [params.id], (err2, topic) => {
            if (err2) throw err2;

            db.query(`SELECT * FROM author`, (err2, authros) => {
                var id = topic[0].id
                var title = topic[0].title
                var description = topic[0].description
                var list = template.list(topics);
                var html = template.html(title, list,
                    ` 
                    <form action="/topic/update_process" method="post">
                        <input type="hidden" name="id" value="${id}" />
                        <p><input type="text" name="title" placeholder="title" value="${title}" /></p>
                        <p><textarea name="description" placeholder="description">${description}</textarea></p>
                        <p>${template.authorSelect(authros, topic[0].author_id)}</p>
                        <p><input type="submit" /></p>
                    </form>
                    `,
                    `   <a href="/topic/create">create</a>
                        <a href="/topic/update/${id}">update</a>
                        <form action="/topic/delete_process" method="post" onsubmit="return confirm('${title}을 삭제하시겠습니까?');">
                            <input type="hidden" name="id" value="${id}" />
                            <input type="submit" value="delete" />
                        </form>
                    `
                );

                response.send(html);
            });
        });
    });
}

exports.update_process = function (request, response) {
    var post = request.body;

    db.query(`
    UPDATE topic 
    SET title=?, description=?, author_id=?
    WHERE id=? `,
        [post.title, post.description, post.author, post.id],
        (err, results) => {
            if (err) throw err;

            response.redirect(`/topic/${post.id}`);
        }
    );
}

exports.delete_process = function (request, response) {
    var post = request.body

    db.query(`DELETE FROM topic WHERE id=?`, [post.id], (err) => {
        if (err) throw err;

        response.redirect('/');
    });
}