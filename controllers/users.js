import User from "../models/user.js";

const users = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", `${username} ,Welcome  to Yelp camp!`);
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  },

  renderLogin: (req, res) => {
    res.render("users/login");
  },
  login: (req, res) => {
    const { username } = req.body;
    req.flash("success", `${username} ,Welcome back  to Yelp camp!`);
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  },
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "you have been successfuly been logged out!");
      res.redirect("/campgrounds");
    });
  },
};

export default users;
