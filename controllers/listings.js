const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudConfig.js");

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW
module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },   // ✅ populates review authors
    })
    .populate("owner");               // ✅ populates listing owner

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// CREATE
module.exports.createListings = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {                     // ✅ safely check if file exists
    newListing.image = {
      url: req.file.path,             // cloudinary gives url in path
      filename: req.file.filename,
    };
  }

  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

// EDIT FORM
module.exports.renderEditform = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE
module.exports.Updatelistings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.file) {                     // ✅ safely check if file exists
    // ✅ delete old image from cloudinary
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);

  // ✅ delete image from cloudinary when listing is deleted
  if (listing && listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};