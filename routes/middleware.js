import Campground from "../models/campground.js";
import Review from "../models/review.js";
import { campgroundSchema } from "../schemas.js";
import { ReviewSchema } from "../schemas.js";
import ExpressErrors from "../utils/ExpressErrors.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

export const validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrors(msg, 400);
  } else {
    next();
  }
};
export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // add this line
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};
export const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

export const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrors(msg, 400);
  } else {
    next();
  }
};

export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "you do not have permisssion to do that");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "you do not have permisssion to do that");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
};

export const isValidLocation = async (req, res, next) => {
  try {
    const addr = req.body.campground.location;

    // Geocode the address
    const response = await geocodingClient
      .forwardGeocode({
        query: addr,
        limit: 1,
      })
      .send();

    const features = response.body.features;

    if (features.length > 0) {
      // The syntax of the input location is correct
      req.validatedLocation = features[0].place_name;
      next();
    } else {
      // Invalid address or other geocoding error
      const errorObject = {
        message: "please ender a valid address  ex:(Beirut, lebanon)",
      };

      res.status(400).render("error", { err: errorObject });
    }
  } catch (error) {
    // Handle other errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
