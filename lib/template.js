module.exports = {
    html : function(title, list, body, control) {
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    },
    list: function(filelist) {
        var list = '<ul>';
        filelist.forEach(f => {
            list += `<li><a href="/?id=${f}">${f}</a></li>`
        });
        list = list + '</ul>';
        return list;
    }
}