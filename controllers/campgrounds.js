import Campground from "../models/campground.js";
import { cloudinary } from "../cloudinary/index.js";

export const campgrounds = {
  index: async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("Campgrounds/index", { campgrounds });
  },
  renderNewForm: (req, res) => {
    res.render("campgrounds/new");
  },

  createCampground: async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressErrors("Invalid camp data", 400);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  },

  showCampground: async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    // campground.author = req.user._id;
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  },

  renderEditForm: async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  },

  updateCampground: async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    campground.images.push(...imgs);
    await campground.save();

    // here we are updating(deleting/pull) from the images array where the file name is IN req.body.deleteImages array
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
  },

  deleteCampground: async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  },
};
