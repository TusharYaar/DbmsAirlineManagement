var middleware = {};

middleware.checkAdmin = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "admin") {
        next();
    } else {
        req.flash("warning","Only Admin can access this page");
        res.redirect("/dashboard");
    }
};
middleware.checkCrew = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "crew") {
        next();
    } else {
        req.flash("warning","Only Crew can access this page");
        res.redirect("Dashboard");
    }
};

middleware.sessionChecker = (req, res, next) => {
    if (req.session.email && req.session.userid && req.session.first_name) {
        next();
    } else {
        req.flash("error","please Login to Continue");
        res.redirect("/login");
    }
};
middleware.isLoggedIn = function(req, res, next) {
    if (req.session.userid && req.session.first_name)
    {   req.flash("warning","You are already logged in");
        res.redirect("/dashboard");}
    else
    next();
}
middleware.checkUser = (req, res, next) => {
    if (req.session.userid && req.session.usertype == "user") {
        next();
    } else {
        res.redirect("/dashboard");
    }
};

module.exports = middleware;