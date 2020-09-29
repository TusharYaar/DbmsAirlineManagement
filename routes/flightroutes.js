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

router.get("/addflight", checkAdmin, function(req, res) {
    connection.query('SELECT * FROM airport', function(err, result, fields) {
        res.render("./admin/addflight", { airport: result });
    });
});

//!Add Check Admin
router.post("/addflight", checkAdmin, function(req, res) {
    console.log(req.body);
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
                res.render("./admin/admindashboard", { message: "Flight Created Successfully Flight number: " + post.flight_number });
            }
        });
    });
});


router.get("/showflights", checkAdmin, function(req, res) {
    connection.query('SELECT * FROM flight', function(err, result, fields) {
        // res.render("./admin/showflight", { data: result });
        res.json(result);
    });

});

module.exports = router;