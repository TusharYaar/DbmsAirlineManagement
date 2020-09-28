var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tushar',
    database: 'flightdatabase'
});


module.exports = connection;