//review call back store karnyasathi
const Review = require("../models/review");
const Listing = require("../models/listing");        

module.exports.Createreview=async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
newReview.author=req.user._id;
  listing.reviews.push(newReview._id);
console.log(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success","new review created");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deletereview=async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success"," Listing Deleted");
  res.redirect(`/listings/${id}`);
};