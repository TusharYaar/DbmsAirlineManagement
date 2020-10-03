const express = require('express'),
    router = express.Router();


var connection = require('../models/sql');


var checkAdmin = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "admin") {
        next();
    } else {
        res.redirect("Dashboard");
    }
};

router.get("/addairport", checkAdmin, function(req, res) {
    res.render("./admin/addairport");
});

router.post("/addairport", checkAdmin, function(req, res) {
    connection.query('SELECT count(*) as numb FROM airport', function(err, result, fields) {
        var count = parseInt((result[0].numb) ? result[0].numb : 0);
        var post = {
            airport_id: "A" + (count + 1),
            airport_name: req.body.airport_name.toLowerCase(),
            airport_city: req.body.airport_city.toLowerCase(),
            airport_state: req.body.airport_state.toLowerCase()
        };
        connection.query('INSERT INTO airport SET ?', post, function(err, result, fields) {
            if (err) {
                console.log(err);
                res.render("./admin/admindashboard", { message: "Airport Cannot Be Added Encountered Some error check your inputs. " });
            };
            res.render("./admin/admindashboard", { message: "Airport has been added successfully. Airport ID: " + post.airport_id });
        });
    });

});

router.get("/showairports", checkAdmin, function(req, res) {
    connection.query('SELECT * FROM airport', function(err, result, fields) {
        // res.render("./admin/showairport" { data: result });
        res.json(result);
    });
});


module.exports = router;