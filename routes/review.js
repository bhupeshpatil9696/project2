const express = require("express");
const router = express.Router({ mergeParams: true });   
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErorr.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");        
const{validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const review = require("../models/review.js");

const reviewController=require("../controllers/review.js")


// Post review
router.post("/",isLoggedIn, 
  validateReview, wrapAsync(reviewController.Createreview)
)
;

// Delete review
router.delete("/:reviewId",isLoggedIn,
  isReviewAuthor,
   wrapAsync(reviewController.deletereview));

module.exports = router;                                 