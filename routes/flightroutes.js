const express = require("express"),
  router = express.Router(),
  flash = require("connect-flash"),
  middleware = require("../middleware");

var connection = require("../models/sql");

router.get("/addflight", middleware.checkAdmin, function (req, res) {
  connection.query("SELECT * FROM airport", function (err, result, fields) {
    connection.query("SELECT * from userinfo where usertype = 'crew'", function (err, crew, fields) {
      res.render("./admin/addflight", { airport: result, crew: crew });
    });
  });
});
router.post("/addflight", middleware.checkAdmin, function (req, res) {
  connection.query("SELECT count(*) as numb FROM flight", function (err, result, fields) {
    var count = parseInt(result[0].numb ? result[0].numb : 0);
    var post = {
      flight_number: "F" + (count + 1),
      departure: req.body.departure,
      departure_date: req.body.departure_date,
      departure_time: req.body.departure_time,
      destination: req.body.destination,
      arrival_date: req.body.arrival_date,
      arrival_time: req.body.arrival_time,
      price: req.body.price,
      duration: req.body.duration,
    };
    connection.query("INSERT INTO flight SET ?", post, function (err, result, fields) {
      if (err) {
        console.log(err);
        req.flash("error", "FLight Cannot be created. Server Error");
        res.redirect("/dashboard");
      } else {
        var crew = [];
        req.body.crew.forEach(function (person) {
          crew.push([post.flight_number, person]);
        });
        connection.query("INSERT INTO flightcrew (flight_number, crew_id) VALUES ?", [crew], function (err, crewresult, fields) {
          if (err) {
            console.log(err);
            connection.query("DELETE FROM flight WHERE flight_number = ?", post.flight_number, function (err, result, fields) {
              if (err) {
                console.log(err);
                req.flash("error", "Flight Created but cannot be deleted");
                res.redirect("/dashboard");
              }
            });
            req.flash("error", "Error while adding to flightcrew");
            res.redirect("/dashboard");
          } else {
            req.flash("success", "Flight Created Successfully Flight number: " + post.flight_number);
            res.redirect("/dashboard");
          }
        });
      }
    });
  });
});

router.get("/showflights", middleware.checkAdmin, function (req, res) {
  var sql = " select duration, flight_number,departure_date,departure_time,arrival_date,arrival_time, " + "ap_des.airport_name as des_name, ap_des.airport_state as des_state, ap_des.airport_city as des_city,  " + "ap_dep.airport_name as dep_name, ap_dep.airport_state as dep_state, ap_dep.airport_city as dep_city " + "from flight JOIN airport as ap_dep ON flight.departure = ap_dep.airport_id JOIN airport as ap_des ON flight.destination = ap_des.airport_id ";
  connection.query(sql, function (err, result, fields) {
    res.render("./admin/showflight", { flights: result });
    // res.json(result);
  });
});

router.get("/showflights/:flight", middleware.checkAdmin, function (req, res) {
  flightid = req.params.flight;
  sql =
    "SELECT duration, flight.flight_number,departure_date,departure_time,arrival_date,arrival_time, ap_des.airport_name as des_name, " +
    "ap_des.airport_state as des_state, ap_des.airport_city as des_city, ap_des.airport_short as des_short, " +
    "ap_dep.airport_name as dep_name, ap_dep.airport_state as dep_state, ap_dep.airport_city as dep_city, ap_dep.airport_short as dep_short, " +
    "first_name, last_name, email, phone, occupation from flight " +
    "JOIN flightcrew as crew ON flight.flight_number = crew.flight_number " +
    "JOIN airport as ap_dep ON flight.departure = ap_dep.airport_id " +
    "JOIN airport as ap_des ON flight.destination = ap_des.airport_id " +
    "JOIN userinfo ON userid = crew_id " +
    "WHERE flight.flight_number = ? ";
  connection.query(sql, [flightid], function (err, crew, fields) {
    if (err) {
      console.log(err);
    } else {
      sql2 = "select * from userinfo " + "join bookedflight on bookedflight.userid = userinfo.userid " + "join flight on bookedflight.flight_number = flight.flight_number " + "where bookedflight.flight_number = ? ";
      connection.query(sql2, [flightid], function (err, users, fields) {
        if (err) {
          console.log(err);
          req.flash("error", "Error while featching the details of passenger");
          res.redirect("/dashboard");
        } else {
          res.send({ crew: crew, User: users });
        }
      });
    }
  });
});

module.exports = router;
