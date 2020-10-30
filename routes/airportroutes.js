const express = require("express"),
  router = express.Router(),
  middleware = require("../middleware"),
  flash = require("connect-flash");

var connection = require("../models/sql");

router.get("/addairport", middleware.checkAdmin, function (req, res) {
  res.render("./admin/addairport");
});

router.post("/addairport", middleware.checkAdmin, function (req, res) {
  connection.query("SELECT count(*) as numb FROM airport", function (err, result, fields) {
    var count = parseInt(result[0].numb ? result[0].numb : 0);
    var post = {
      airport_id: "A" + (count + 1),
      airport_name: req.body.airport_name.toLowerCase(),
      airport_city: req.body.airport_city.toLowerCase(),
      airport_state: req.body.airport_state.toLowerCase(),
      airport_short: req.body.airport_short.toUpperCase(),
    };
    connection.query("INSERT INTO airport SET ?", post, function (err, result, fields) {
      if (err) {
        console.log(err);
        req.flash("error", "Airport Cannot Be Added Encountered Some error check your inputs. ");
        res.redirect("/dashboard");
      }
      req.flash("Airport has been added successfully. Airport ID: " + post.airport_id);
      res.redirect("/dashboard");
    });
  });
});

router.get("/showairports", middleware.checkAdmin, function (req, res) {
  sql = "SELECT * FROM airport";
  if (req.query.orderby) {
    sql = sql + " ORDER BY " + req.query.orderby;
    sql += " " + req.query.order;
  }
  connection.query(sql, function (err, result, fields) {
    res.render("./admin/showairport", { airports: result });
    // res.json(result);
  });
});
router.get("/showairports/:airport", middleware.checkAdmin, function (req, res) {
  connection.query(
    "SELECT flight_number, curap.airport_id as curid, curap.airport_name as curname, curap.airport_state as curstate, curap.airport_short as curshort,desap.airport_id as desid, desap.airport_name as desname, desap.airport_short as desshort, departure_time, departure_date, arrival_date, arrival_time from flight JOIN airport as curap ON flight.departure = curap.airport_id JOIN airport as desap ON flight.destination = desap.airport_id where curap.airport_id = ? ",
    req.params.airport,
    function (err, depairport, fields) {
      if (err) {
        console.log(err);
        req.flash("error", "Airport Cannot Be Displayed, Encountered Some Error");
        res.redirect("/dashboard");
      } else {
        connection.query(
          "SELECT flight_number, curap.airport_id as curid, curap.airport_name as curname, curap.airport_state as curstate, curap.airport_short as curshort, depap.airport_name as depname, depap.airport_short as depshort, depap.airport_id as depid, departure_time, departure_date, arrival_date, arrival_time from flight JOIN airport as curap ON flight.destination = curap.airport_id JOIN airport as depap ON flight.departure = depap.airport_id where curap.airport_id = ? ",
          req.params.airport,
          function (err, result, fields) {
            if (err) {
              console.log(err);
              req.flash("error", "Airport Cannot Be Displayed, Encountered Some Error");
              res.redirect("/dashboard");
            } else {
              res.render("./admin/viewairportdetails", { depairport: depairport, desairport: result });
              // res.send({ depairport: depairport, desairport: result });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
