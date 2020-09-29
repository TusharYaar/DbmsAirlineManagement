var mysql = require('mysql');

var db_config = {
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'be2aea29eef7b6',
    password: '85e2a4a6',
    database: 'heroku_a30f9d24d78dbdd'
};
var db_config2 = {
    host: 'sm9j2j5q6c8bpgyq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'ow9sfihrl1htyxak',
    password: 'i2zdwwk5ypiwepjv',
    database: 'vgloi02hni56ec3w'
};

var connection;

function handleDisconnect() {

    connection = mysql.createConnection(db_config2);

    connection.connect(function(err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 4000); // We introduce a delay before attempting to reconnect,
        } else { console.log('connection Successfull'); } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}

handleDisconnect();
module.exports = connection;