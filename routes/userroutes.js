var express = require('express');
var router = express.Router();






var connection = require('../models/sql');



var checkUser = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "user") {
        next();
    } else {
        res.redirect("Dashboard");
    }
};


router.get("/searchflight", checkUser, function(req, res) {
    connection.query('SELECT * FROM airport', function(err, result, fields) {
        res.render("./user/searchflight", { airport: result });
    });
});
router.post("/searchflight", checkUser, function(req, res) {
    connection.query('SELECT * FROM flight WHERE departure = ? AND destination = ? AND departure_date = ?', [req.body.departure, req.body.destination, req.body.date], function(err, result, fields) {
        if (err) {
            console.log(err);
            res.send("error");
        }
        res.send(result);
    });
});



module.exports = router;