const session = require('express-session'),
    bodyParser = require("body-parser"),
    express = require("express"),
    app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var PORT = process.env.PORT || 3000;


var loginRoute = require("./routes/login"),
    connection = require("./models/sql");

app.use(session({
    secret: 'this is a random secret key for testing the user login',
    resave: true,
    saveUninitialized: true
}));

// ======================================
//          ROUTESSSS REQUIRED
// ====================================
app.use(loginRoute);




// ======================
//  MISLANEOUS FUNCTIONS
// ================================
var sessionChecker = (req, res, next) => {
    if (req.session.email && req.session.userid && req.session.first_name && req.session.usertype) {
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



// ===========SEE at LAST===========
app.get("*", function(req, res) {
    res.send("You hit the error route");
});
app.listen(PORT, function() {
    console.log("Server is flying");
});