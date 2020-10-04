var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var middleware = require('../middleware');

var connection = require('../models/sql');



router.get("/searchflight", function(req, res) {
    connection.query('SELECT * FROM airport', function(err, result, fields) {
        res.render("./user/searchflight", { airport: result, message:req.session.email || null });
    });
});
router.post("/searchflight", function(req, res) {
    var sql = " select flight_number,departure_date,departure_time,arrival_date,arrival_time, " +
        "ap_des.airport_name AS des_name, ap_des.airport_state AS des_state, ap_des.airport_city AS des_city, ap_des.airport_short AS des_short, " +
        "ap_dep.airport_name AS dep_name, ap_dep.airport_state AS dep_state, ap_dep.airport_city AS dep_city, ap_dep.airport_short AS dep_short " +
        "from flight JOIN airport AS ap_dep ON flight.departure = ap_dep.airport_id JOIN airport AS ap_des ON flight.destination = ap_des.airport_id " +
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

router.get("/searchflight/:flight",function(req, res){
    flight = req.params.flight;
    var sql = " SELECT flight.flight_number, departure_date,departure_time, arrival_date, arrival_time, " +
    "ap_des.airport_name AS des_name, ap_des.airport_state AS des_state, ap_des.airport_city AS des_city, ap_des.airport_short AS des_short, " +
    "ap_dep.airport_name AS dep_name, ap_dep.airport_state AS dep_state, ap_dep.airport_city AS dep_city, ap_dep.airport_short AS dep_short " +
    "from flight JOIN airport AS ap_dep ON flight.departure = ap_dep.airport_id JOIN airport AS ap_des ON flight.destination = ap_des.airport_id " +
    "WHERE flight.flight_number = ?"
    connection.query(sql,[flight],function(err, result, fields){
        if(err) {
            console.log(err);
            res.send("Error");
        }
        else {
            var sql2 = "select seat_number FROM flight JOIN bookedflight ON flight.flight_number = bookedflight.flight_number "+
            "WHERE flight.flight_number = ?"
            connection.query(sql2,[flight],function(err, seats, fields){
                if (err){ console.log(err);
                res.send(error);
            } else {
                res.render("./user/bookticket",{flight: result,seats: seats});}
            });
            
            // res.send(result);
        }
    });
});

router.post("/searchflight/:flight",middleware.checkUser, function (req,res) {
    // console.log(req.body);
    var data = [];
    connection.query('SELECT count(ticket_number) AS numb FROM bookedflight',function (err, result, fields){
        var count = parseInt((result[0].numb) ? result[0].numb : 0);
        req.body.check.forEach(function (ticket,index){
            count++;
            data.push(["T"+count,req.session.userid,req.params.flight,req.body.username[index],ticket]);
        });
        connection.query("INSERT INTO bookedflight VALUES ? ",[data],function(err, result, fields){
            if(err){ console.log(err);
            res.send("Error addin to the table");
            }
            else{
                req.flash("success","Seats have been booked!!");
                res.redirect("/dashboard");
            }
        });
    });
});

module.exports = router;