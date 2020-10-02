const session = require('express-session'),
    bodyParser = require("body-parser"),
    express = require("express"),
    app = express();

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var PORT = process.env.PORT || 3000;

var connection = require("./models/sql");

var loginRoute = require("./routes/login"),
    adminRoute = require("./routes/adminroutes"),
    airportRoute = require("./routes/airportroutes"),
    flightRoute = require("./routes/flightroutes"),
    userRoute = require("./routes/userroutes");

app.use(session({
    secret: 'this is a random secret key for testing the user login',
    resave: true,
    saveUninitialized: true
}));

// ======================================
//          ROUTESSSS REQUIRED
// ====================================
app.use(loginRoute);
app.use(adminRoute);
app.use(airportRoute);
app.use(flightRoute);
app.use(userRoute);

// ======================
//  MISLANEOUS FUNCTIONS
// ================================
var sessionChecker = (req, res, next) => {
    if (req.session.email && req.session.userid) {
        next();
    } else {
        res.redirect("login");
    }
};


// ===============================
// End Of REQUIRE
// =================




// =======================================
// Routes
// ========================

app.get("/secret", sessionChecker, function(req, res) {
    res.render("secret", { user: req.session.first_name, userid: req.session.userid, email: req.session.email, type: req.session.usertype });
});

app.get("/logout", sessionChecker, function(req, res) {
    req.session.destroy();
    res.send("You have been logged out.<br> <a href='/'>Click Here</a> to goto home page ");
});

app.get("/addadmin", function(req, res) {
    if (PORT == 3000)
        res.render("./admin/addadmin");
    else {
        console.log("Acceses from Net");
        res.send("You are not authorized to add admin from this port");
    }
});

app.post("/addadmin", function(req, res) {
    if (PORT != 3000) {
        res.send("You are not authorized to add admin from this port");
    }
    var email = req.body.email;
    connection.query('SELECT * FROM userinfo WHERE email = ?', email, function(err, result, fields) {
        if (result && result.length > 0) {
            res.send("User with this email already exists!! Goto <a href='/login'>login</a>");
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
                    passport_number: (req.body.passport_number).toUpperCase(),
                    dob: req.body.date,
                    usertype: "admin",
                    occupation: "admin"
                };
                connection.query('INSERT INTO userinfo SET ?', post, function(err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.send("Admin Account NOT Created!! Goto <a href='/login'>login</a>");
                    }
                    res.send("Admin Account Created!! Goto <a href='/login'>login</a>");
                });
            });
        };
    });
});

// ===========SEE at LAST===========
app.get("*", function(req, res) {
    res.send("You hit the error route");
});
app.listen(PORT, function() {
    console.log("Server is flying");
});