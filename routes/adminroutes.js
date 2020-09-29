var express = require('express');
var router = express.Router();
var connection = require('../models/sql');


var sessionChecker = (req, res, next) => {
    // console.log(req.session.email, req.session.userid, req.session.first_name)
    if (req.session.email && req.session.userid && req.session.first_name) {
        next();
    } else {
        res.redirect("login");
    }
};
var checkAdmin = (req, res, next) => {
    if (req.session.usertype = "admin") {
        next();
    } else {
        res.redirect("Dashboard");
    }
};


router.get("/addairport", sessionChecker, checkAdmin, function(req, res) { res.send("this is an admin exclusive page") });





















module.exports = router;