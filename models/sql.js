var mysql = require('mysql');
var db_config = {
    host: 'sm9j2j5q6c8bpgyq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'ow9sfihrl1htyxak',
    password: 'i2zdwwk5ypiwepjv',
    database: 'vgloi02hni56ec3w'
};

var db_config_local = {
    host: 'localhost',
    user: 'root',
    password: 'tushar',
    database: 'flightdatabase'
};
var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config_local);
    connection.connect(function(err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 4000); // We introduce a delay before attempting to reconnect,
        } else { console.log('connection Successfull'); } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();
module.exports = connection;