var express = require('express');
var router = express.Router();
var connection = require('../models/sql');
var bcrypt = require('bcrypt');


var checkAdmin = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "admin") {
        next();
    } else {
        res.redirect("dashboard");
    }
};

router.get("/showusers", checkAdmin, function(req, res) {
    connection.query('SELECT * FROM userinfo', function(err, result, fields) {
        // res.render("./admin/showusers", { data: result });
        res.send(result);
    });

});

router.get("/addcrew", checkAdmin, function(req, res) { res.render("./admin/addcrew"); });

router.post("/addcrew", checkAdmin, function(req, res) {
    var email = req.body.email;
    connection.query('SELECT * FROM userinfo WHERE email = ?', email, function(err, result, fields) {
        if (result && result.length > 0) {
            res.render("./admin/admindashboard", { message: "Entered Email Already Exists" });
        } else {
            connection.query('SELECT count(userid) as numb FROM userinfo ', function(err, result, fields) {
                var usercount = parseInt((result[0].numb) ? result[0].numb : 0);
                var post = {
                    userid: "U" + (usercount + 1),
                    pass: req.body.password,
                    first_name: req.body.first_name.toLowerCase(),
                    last_name: req.body.last_name.toLowerCase(),
                    email: req.body.email.toLowerCase(),
                    phone: parseInt(req.body.phone),
                    passport_number: req.body.passport_number.toUpperCase(),
                    dob: req.body.date,
                    usertype: "crew",
                    occupation: req.body.occupation.toLowerCase(),
                };
                bcrypt.hash(req.body.password, 10,function (err, hash) {
                    post.pass=hash;
                    connection.query('INSERT INTO userinfo SET ?', post, function(err, result, fields) {
                        if (err){ console.log(err);
                            res.render("./admin/admindashboard", { message: "Crew was not created. Check your inputs" });
                        }
                        else
                        res.render("./admin/admindashboard", { message: "Crew has been added successfully. Crew ID: " + post.userid }); 
                    });
                });
            });
        };
    });
});




module.exports = router;