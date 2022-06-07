module.exports = {
    html : function(title, list, body, control, isOwner=false) {
        var authStatusUI = '';
        if(isOwner) {
            authStatusUI = '<h1><a href="/login/logout_process">logout</a></h1>';
        } else {
            authStatusUI = '<h1><a href="/login">login</a></h1>';
        }

        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${authStatusUI}
            <p><a href="/chat">chat</a></p>
            <p><a href="/author">author</a></p>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    },
    
    list: function(lists) {
        var list = '<ul>';
        lists.forEach(f => {
            list += `<li><a href="/topic/${f.id}">${f.title}</a></li>`
        });
        list = list + '</ul>';
        return list;
    },
    
    authorSelect: function(authros, author_id) {
        var tag_select = `<select name="author">`;
        authros.forEach(author => {
            var selected = (author.id==author_id) ? " selected" : "";
            tag_select += `<option value="${author.id}" ${selected}>${author.name}</option>`;
        });
        tag_select += '</select>';

        return tag_select;
    },

    authorTable: function(authros) {
        var tag_tr = '<table>';
        authros.forEach(author => {
            tag_tr += `
                <tr>
                    <td>${author.name}</td>
                    <td>${author.profile}</td>
                    <td><a href="/author/update/${author.id}">update</a></td>
                    <td>
                        <form action="/author/delete_process" method="post" onsubmit="return confirm('${author.name}을 삭제하시겠습니까?');">
                            <input type="hidden" name="id" value="${author.id}" />
                            <input type="submit" value="delete" />
                        </form>
                    </td>
                </tr>
            `;
        });
        tag_tr += '</table>'

        return tag_tr;
    }
}