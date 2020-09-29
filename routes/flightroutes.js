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
router.post("/addflight", function(req, res) {
    // connection.query('SELECT count(*) as numb FROM flight', function(err, result, fields) {
    //     var count = parseInt((result[0].numb) ? result[0].numb : 0);
    //     var post = {
    //         flight_number: "F" + (count + 1),
    //         departure: req.body.departure,
    //         destination: req.body.destination,
    //         arrival_date: req.body.arrival_date,

    //         departure_date: req.body.departure_date,
    //     };


    // });
    console.log(req.body);
    res.send("You hit the Post Route for Flights");
});




module.exports = router;