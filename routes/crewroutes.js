const express = require('express'),
 router = express.Router(),
 flash = require('connect-flash'),
 connection = require('../models/sql'),
 middleware = require('../middleware');


router.get("/assignedflights",middleware.checkCrew, function(req, res){
    var sql = "SELECT flight.flight_number,departure_date,departure_time,arrival_date,arrival_time, ap_des.airport_name as des_name, "+
    "ap_des.airport_state as des_state, ap_des.airport_city as des_city, ap_des.airport_short as des_short, ap_dep.airport_name as dep_name, "+
    "ap_dep.airport_state as dep_state, ap_dep.airport_city as dep_city, ap_dep.airport_short as dep_short, crew.crew_id from flight " +
    "join flightcrew as crew on flight.flight_number = crew.flight_number " + 
    "join airport as ap_dep on flight.departure = ap_dep.airport_id " +
    "join airport as ap_des on flight.destination = ap_des.airport_id WHERE crew_id = ?"
    connection.query(sql,req.session.userid,function(err, result, fields){
        res.send(result);
    });
});








module.exports = router;