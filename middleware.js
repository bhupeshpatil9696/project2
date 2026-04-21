const Listings=require("./models/listing");
const Review=require("./models/review")
const ExpressError = require("./utils/ExpressErorr.js");
const { listingSchema } = require("./schema.js");
const {  reviewSchema } = require("./schema.js");


// login sathi
module.exports.isLoggedIn=(req,res,next)=>{
  console.log(req.path,"..",req.originalUrl);
    if (!req.isAuthenticated()) {
      req.session.redirectUrl=req.originalUrl
    req.flash("error", "you must be logged in to create Listing!");
    return res.redirect("/login");   
  }
  next();
 
};
//local ke andar save 
module.exports.saveRedirectUrl=(req,res,next)=>{
  if (req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;

  }
  next();
}
//for owner verication to delete and edit
 module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you have no permission to perform operation");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// validate listings
 module.exports.validateListings = (req, res, next) => {
   let { error } = listingSchema.validate(req.body);
   if (error) {
     let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, errMsg);
   } else {
     next();
   }
 };

 //validate review
  module.exports.validateReview = (req, res, next) => {
   let { error } = reviewSchema.validate(req.body);
   if (error) {
     let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400, errMsg);
   } else {
     next();
   }
 };
 // reveiew sathi

module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId, id } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to delete this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};