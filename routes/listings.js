const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListings}=require("../middleware.js");
const  listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })


//router.route = compact form on one common route
router
.route("/")
// index
.get( wrapAsync(listingController.index))
//create
.post(
  isLoggedIn, 
  upload.single('listing[image]')// added to upload
  ,validateListings,
  wrapAsync(listingController.createListings)
);


// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


// routers
router
.route("/:id")
.get(
  wrapAsync(listingController.showListings)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'), // validatedListings se pehle
  validateListings,
  wrapAsync(listingController.Updatelistings)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListings)  
);

// edit route 

router.get("/:id/edit", 
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditform));

/*update
router.put("/:id",isLoggedIn,
  isOwner,
  validateListings,
   wrapAsync(listingController.Updatelistings));

// delete
router.delete("/:id",isLoggedIn,
   isOwner, 
  wrapAsync(listingController.Updatelistings));
*/
module.exports = router;