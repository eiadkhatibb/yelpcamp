import express from "express";
const router = express.Router();
import CatchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";
import { campgrounds } from "../controllers/campgrounds.js";
import { isLoggedIn, validateCampground, isAuthor } from "./middleware.js";

router
  .route("/")
  .get(CatchAsync(campgrounds.index))
  .post(validateCampground, CatchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);
router
  .route("/:id")
  .get(CatchAsync(campgrounds.showCampground))
  .put(validateCampground, isAuthor, CatchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  CatchAsync(campgrounds.renderEditForm)
);

export default router;
