const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yk2201',
    database: 'opentutorials'
});
db.connect();

module.exports = db;