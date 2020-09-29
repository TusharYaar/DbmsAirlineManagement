var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'be2aea29eef7b6',
    password: '85e2a4a6',
    database: 'heroku_a30f9d24d78dbdd'
});


module.exports = connection;