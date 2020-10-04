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
        res.render("./admin/admindashboard");
    } else if (req.session.usertype == "crew") {
        res.render("./crew/crewdashboard");
    } else if (req.session.usertype == "user") {
        res.render("./user/userdashboard");
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
                            req.flash('error',"Incorrect Password OR Email");
                            res.redirect("/login");
                        }
                        else {
                        req.session.loggedin = true;
                        req.session.email = email;
                        req.session.first_name = results[0].first_name;
                        req.session.userid = results[0].userid;
                        req.session.usertype = results[0].usertype;
                        req.flash("success","Welcome back User!!");
                        res.redirect("/secret");}
            });}
            else {
                req.flash('error','User with entered Email Not Found');
                res.redirect("/login");
            }
        });
    }
});


router.post('/register', function(req, res) {
    var email = req.body.email;
    connection.query('SELECT * FROM userinfo WHERE email = ?', email, function(err, result, fields) {
        if (result && result.length > 0) {
            req.flash("error","User with given Email Already Exists!!");
            res.redirect("/login");
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
                            res.flash("success","User Created!! Please Login");
                            res.redirect("/login");
                    });
                });
            });
        };
    });
});


module.exports = router;