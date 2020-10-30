const express = require("express");
const router = express.Router();
const connection = require("../models/sql");
const bcrypt = require("bcrypt");
const flash = require("connect-flash"),
  middleware = require("../middleware");

router.get("/showusers", middleware.checkAdmin, function (req, res) {
  sql = "SELECT * FROM userinfo";
  if (req.query.orderby) {
    sql = sql + " ORDER BY " + req.query.orderby;
    sql += " " + req.query.order;
  }
  connection.query(sql, function (err, result, fields) {
    res.render("./admin/showusers", { data: result });
    // res.send(result);
  });
});

router.get("/showusers/:user", middleware.checkAdmin, function (req, res) {
  connection.query(
    "SELECT ticket_number, userid, flight.flight_number, username, desap.airport_name as desname, desap.airport_short as desshort,	depap.airport_name as depname, depap.airport_short as depshort, departure_date, departure_time, arrival_date, arrival_time from bookedflight JOIN flight ON flight.flight_number = bookedflight.flight_number JOIN airport as desap ON desap.airport_id = flight.destination JOIN airport as depap ON depap.airport_id = flight.departure WHERE bookedflight.userid = ?",
    req.params.user,
    function (err, result, fields) {
      if (err) {
        console.log(err);
        req.flash("error", "User Cannot Be Shown");
        res.redirect("/dashboard");
      } else {
        res.render("./admin/viewuserdetails", { result: result });
        // res.send(result);
      }
    }
  );
});

router.get("/addcrew", middleware.checkAdmin, function (req, res) {
  res.render("./admin/addcrew");
});

router.post("/addcrew", middleware.checkAdmin, function (req, res) {
  var email = req.body.email;
  connection.query("SELECT * FROM userinfo WHERE email = ?", email, function (err, result, fields) {
    if (result && result.length > 0) {
      res.render("./admin/admindashboard", { message: "Entered Email Already Exists" });
    } else {
      connection.query("SELECT count(userid) as numb FROM userinfo ", function (err, result, fields) {
        var usercount = parseInt(result[0].numb ? result[0].numb : 0);
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
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          post.pass = hash;
          connection.query("INSERT INTO userinfo SET ?", post, function (err, result, fields) {
            if (err) {
              console.log(err);
              res.render("./admin/admindashboard", { message: "Crew was not created. Check your inputs" });
            } else res.render("./admin/admindashboard", { message: "Crew has been added successfully. Crew ID: " + post.userid });
          });
        });
      });
    }
  });
});

module.exports = router;
