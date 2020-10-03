var express = require('express');
var router = express.Router();






var connection = require('../models/sql');



var checkUser = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "user") {
        next();
    } else {
        res.redirect("/dashboard");
    }
};
router.get("/searchflight", function(req, res) {
    connection.query('SELECT * FROM airport', function(err, result, fields) {
        res.render("./user/searchflight", { airport: result, message:req.session.email || null });
    });
});
router.post("/searchflight", function(req, res) {
    var sql = " select flight_number,departure_date,departure_time,arrival_date,arrival_time, " +
        "ap_des.airport_name as des_name, ap_des.airport_state as des_state, ap_des.airport_city as des_city, ap_des.airport_short as des_short, " +
        "ap_dep.airport_name as dep_name, ap_dep.airport_state as dep_state, ap_dep.airport_city as dep_city, ap_dep.airport_short as dep_short " +
        "from flight join airport as ap_dep on flight.departure = ap_dep.airport_id join airport as ap_des on flight.destination = ap_des.airport_id " +
        "WHERE departure = ? AND destination = ? AND departure_date = ? "
    connection.query(sql, [req.body.departure, req.body.destination, req.body.date], function(err, results, fields) {
        if (err) {
            console.log(err);
            res.send("error");
        } else {
            // res.send(results);
            connection.query('SELECT * FROM airport', function(err, result, fields) {
                if (err) {
                    console.log(err);
                    res.send("error");
                }
                res.render("./user/searchflightresult", { airport: result, flight: results,message: req.session.email || null});
            });
        }
    });
});

router.get("/searchflight/:flight",checkUser,function(req, res){
    flight = req.params.flight;
    sql = " select flight_number,departure_date,departure_time,arrival_date,arrival_time, " +
    "ap_des.airport_name as des_name, ap_des.airport_state as des_state, ap_des.airport_city as des_city, ap_des.airport_short as des_short, " +
    "ap_dep.airport_name as dep_name, ap_dep.airport_state as dep_state, ap_dep.airport_city as dep_city, ap_dep.airport_short as dep_short " +
    "from flight join airport as ap_dep on flight.departure = ap_dep.airport_id join airport as ap_des on flight.destination = ap_des.airport_id " +
    "WHERE flight.flight_number = ?"
    connection.query(sql,[flight],function(err, result, fields){
        if(err) {
            console.log(err);
            res.send("Error");
        }
        else {
            res.send(result);
        }
    });
});


module.exports = router;