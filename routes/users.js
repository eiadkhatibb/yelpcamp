import express from "express";
const router = express.Router({ mergeParams: true });
import User from "../models/user.js";
// import { Userschema } from "../schemas.js";
import CatchAsync from "../utils/catchAsync.js";
import ExpressErrors from "../utils/ExpressErrors.js";
import passport from "passport";
import { storeReturnTo } from "./middleware.js";
import users from "../controllers/users.js";
router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", CatchAsync(users.register));

router.get("/login", users.renderLogin);
router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);
router.get("/logout", users.logout);

export default router;
