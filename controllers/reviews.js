import Campground from "../models/campground.js";
import Review from "../models/review.js";

const reviews = {
  createReview: async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review created successfully");
    res.redirect(`/campgrounds/${campground._id}`);
  },
  deleteReviews: async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(req.params.id);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/campgrounds/${campground._id}`);
  },
};

export default reviews;
