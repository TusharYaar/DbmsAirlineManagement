// This file contains routes for Login and Register
// this has both Get and Post routes

const express = require('express'),
    router = express.Router(),
    bcrypt = require('bcrypt'),
    flash = require('connect-flash'),
    middleware = require('../middleware');
var connection = require('../models/sql');

router.get("/", function(req, res) { res.redirect("/searchflight"); });
router.get("/login",middleware.isLoggedIn, function(req, res) { res.render("login"); });
router.get("/register",middleware.isLoggedIn, function(req, res) { res.render("register"); });




router.get("/dashboard", middleware.sessionChecker, function(req, res) {
    if (req.session.usertype == "admin") {
        res.render("./admin/admindashboard", { message: null });
    } else if (req.session.usertype == "crew") {
        res.render("./crew/crewdashboard", { message: null });
    } else if (req.session.usertype == "user") {
        res.render("./user/userdashboard", { message: null });
    }
});


router.post('/login',middleware.isLoggedIn ,function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {
        connection.query('SELECT * FROM userinfo WHERE email = ?', [email], function(error, results, fields) {
            if (results && results.length > 0) {
                    bcrypt.compare(req.body.password, results[0].pass,function(err, result){
                        if(!result) {
                            res.redirect("/login");
                        }
                        else {
                        req.session.loggedin = true;
                        req.session.email = email;
                        req.session.first_name = results[0].first_name;
                        req.session.userid = results[0].userid;
                        req.session.usertype = results[0].usertype;
                        res.redirect("/secret");}
            });}
            else {
                res.redirect("/login",{message: req.flash("login_message")});
            }
        });
    }
});


router.post('/register', function(req, res) {
    var email = req.body.email;
    connection.query('SELECT * FROM userinfo WHERE email = ?', email, function(err, result, fields) {
        if (result && result.length > 0) {
            res.send("user already exists <a href='/register'> Try again<a>");
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
                    usertype: "user",
                    occupation: req.body.occupation.toLowerCase()
                };
                bcrypt.hash(req.body.password, 10,function (err, hash) {
                    post.pass=hash;
                    connection.query('INSERT INTO userinfo SET ?', post, function(err, result, fields) {
                        if (err) throw err;
                        else 
                            res.render("login",{message:"User created! Please Login to Continue"});
                    });
                });
            });
        };
    });
});


module.exports = router;