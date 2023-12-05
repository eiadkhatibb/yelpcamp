import express from "express";
const router = express.Router();
import CatchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";
import { campgrounds } from "../controllers/campgrounds.js";
import {
  isLoggedIn,
  validateCampground,
  isAuthor,
  isValidLocation,
} from "./middleware.js";
import { storage } from "../cloudinary/index.js";
import multer from "multer";
const upload = multer({ storage });
router
  .route("/")
  .get(CatchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    isValidLocation,
    CatchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);
router
  .route("/:id")
  .get(CatchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    isAuthor,
    isValidLocation,
    CatchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  CatchAsync(campgrounds.renderEditForm)
);

export default router;
