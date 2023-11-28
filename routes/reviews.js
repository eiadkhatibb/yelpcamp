import express from "express";
const router = express.Router({ mergeParams: true });
import CatchAsync from "../utils/catchAsync.js";
import { validateReview, isLoggedIn, isReviewAuthor } from "./middleware.js";
import reviews from "../controllers/reviews.js";

router.post("/", validateReview, isLoggedIn, CatchAsync(reviews.createReview));
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  CatchAsync(reviews.deleteReviews)
);

export default router;
