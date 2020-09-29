// This file contains routes for Login and Register
// this has both Get and Post routes

const express = require('express'),
    router = express.Router();


var connection = require('../models/sql');

var sessionChecker = (req, res, next) => {
    // console.log(req.session.email, req.session.userid, req.session.first_name)
    if (req.session.email && req.session.userid && req.session.first_name) {
        next();
    } else {
        res.redirect("login");
    }
};


router.get("/", function(req, res) { res.render("home"); });
router.get("/login", function(req, res) { res.render("login"); });
router.get("/register", function(req, res) { res.render("register"); });
router.get("/dashboard", sessionChecker, function(req, res) {
    if (req.session.usertype == "admin") {
        res.send("You Are on the Admin Dashboard!");
    } else if (req.session.usertype == "crew") {
        res.send("You are on the crew Dashboard!");
    } else if (req.session.usertype == "user") {
        res.render("./user/userdashboard");
    }
});







router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {
        connection.query('SELECT * FROM userinfo WHERE email = ? AND pass = ?', [email, password], function(error, results, fields) {
            if (results && results.length > 0) {
                req.session.loggedin = true;
                req.session.email = email;
                req.session.first_name = results[0].first_name;
                req.session.userid = results[0].userid;
                req.session.usertype = results[0].usertype;
                res.redirect("/secret");
            } else {
                res.send('Incorrect Username and/or Password! <a href="/login"> Try again </a>');
            }
            res.end();
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
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone: parseInt(req.body.phone),
                    passport_number: parseInt(req.body.passport_number),
                    dob: req.body.date,
                    usertype: "admin"
                };
                connection.query('INSERT INTO userinfo SET ?', post, function(err, result, fields) {
                    if (err) throw err;
                    res.send("user created Now Goto <a href='/login'> Login</a>");
                });
            });
        };
    });
});





module.exports = router;