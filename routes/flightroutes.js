var express = require('express');
var router = express.Router();






var connection = require('../models/sql');



var checkAdmin = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "admin") {
        next();
    } else {
        res.redirect("Dashboard");
    }
};

router.get("/addflight",checkAdmin, function(req, res) {
    connection.query('SELECT * FROM airport', function(err, result, fields) {
        connection.query("SELECT * from userinfo where usertype = 'crew'", function(err, crew, fields){
            res.render("./admin/addflight", { airport: result, crew: crew});
        });

    });
});
router.post("/addflight",checkAdmin, function(req, res) {
    // console.log(req.body);
    // res.send("reached");
    connection.query('SELECT count(*) as numb FROM flight', function(err, result, fields) {
        var count = parseInt((result[0].numb) ? result[0].numb : 0);
        var post = {
            flight_number: "F" + (count + 1),
            departure: req.body.departure,
            departure_date: req.body.departure_date,
            departure_time: req.body.departure_time,
            destination: req.body.destination,
            arrival_date: req.body.arrival_date,
            arrival_time: req.body.arrival_time,
            price: req.body.price
        };
        connection.query('INSERT INTO flight SET ?', post, function(err, result, fields) {
            if (err) {
                console.log(err);
                res.render("./admin/admindashboard", { message: "FLight Cannot be created. Server Error" });
            } else {
                var crew = [];
                req.body.crew.forEach(function(person){crew.push([post.flight_number,person]);});
                // var crew = [[post.flight_number,req.body.pilot],[post.flight_number,req.body.air_hostess],[post.flight_number, req.body.technician]];
                connection.query('INSERT INTO flightcrew (flight_number, crew_id) VALUES ?',[crew] ,function(err, crewresult, fields) {
                    if(err) {console.log(err);
                    connection.query('DELETE FROM flight WHERE flight_number = ?', post.flight_number,function(err, result, fields){
                        if (err) {
                            console.log(err);
                            res.send("Flight Created but cannot be deleted");                            
                        }
                    });
                    res.send("Error while adding to flightcrew");
                    } else {
                        res.render("./admin/admindashboard", { message: "Flight Created Successfully Flight number: " + post.flight_number });
                    }
                });
            }
        });
    });
});


router.get("/showflights", checkAdmin, function(req, res) {
    var sql = " select flight_number,departure_date,departure_time,arrival_date,arrival_time, " +
        "ap_des.airport_name as des_name, ap_des.airport_state as des_state, ap_des.airport_city as des_city,  " +
        "ap_dep.airport_name as dep_name, ap_dep.airport_state as dep_state, ap_dep.airport_city as dep_city " +
        "from flight JOIN airport as ap_dep ON flight.departure = ap_dep.airport_id JOIN airport as ap_des ON flight.destination = ap_des.airport_id "
    connection.query(sql, function(err, result, fields) {
        res.render("./admin/showflight", { flights: result });
        // res.json(result);
    });

});

router.get("/showflights/:flight",checkAdmin, function(req, res){
    flightid =req.params.flight;
    sql = "SELECT flight.flight_number,departure_date,departure_time,arrival_date,arrival_time, ap_des.airport_name as des_name, " +
     "ap_des.airport_state as des_state, ap_des.airport_city as des_city, ap_des.airport_short as des_short, " + 
    "ap_dep.airport_name as dep_name, ap_dep.airport_state as dep_state, ap_dep.airport_city as dep_city, ap_dep.airport_short as dep_short, " + 
	"first_name, last_name, email, phone, occupation from flight " +
    "JOIN flightcrew as crew ON flight.flight_number = crew.flight_number " +
    "JOIN airport as ap_dep ON flight.departure = ap_dep.airport_id " +
    "JOIN airport as ap_des ON flight.destination = ap_des.airport_id " +
    "JOIN userinfo ON userid = crew_id WHERE flight.flight_number = ? " 
    connection.query(sql,flightid ,function(err, result, fields) {
    res.send(result);
    });

});
module.exports = router;