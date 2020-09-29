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


router.get("/showairport", function(req, res) {
    connection.query('SELECT * FROM airport', function(err, result, fields) {
        console.log("Result =: " + result);
        // res.render("./admin/showairport" { data: result });
        res.json(result);
    });
});


module.exports = router;