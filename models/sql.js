var mysql = require("mysql");
var db_config = {
  host: "", // Host name   Eg. localhost
  user: "", // Username in the database    Eg. root
  password: "", // Password in the database Eg. password
  database: "", // Database You want to connect to   Eg. Flight Database
};
// If you want to connect to an Online database Fill the details accodingly
var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);
  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 4000); // We introduce a delay before attempting to reconnect,
    } else {
      console.log("connection Successfull");
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();
module.exports = connection;
