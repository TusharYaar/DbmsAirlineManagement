var middleware = {};
middleware.sessionChecker = (req, res, next) => {
    if (req.session.email && req.session.userid) {
        next();
    } else {
        res.redirect("/login");
    }
};


middleware.checkAdmin = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "admin") {
        next();
    } else {
        res.redirect("/dashboard");
    }
};
middleware.checkCrew = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "crew") {
        next();
    } else {
        res.redirect("Dashboard");
    }
};

middleware.sessionChecker = (req, res, next) => {
    if (req.session.email && req.session.userid && req.session.first_name) {
        next();
    } else {
        req.flash("login_message","please Login to Continue");
        res.redirect("/login");
    }
};
middleware.isLoggedIn = function(req, res, next) {
    if (req.session.userid && req.session.first_name)
    {res.redirect("/dashboard");}
    else
    next();
}


module.exports = middleware;