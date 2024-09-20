const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require('../models/review.js');
const ExpressError = require("../utils/ExpressError.js")
const Listing = require('../models/listing.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// POST review route
 
router.post('/' ,isLoggedIn,validateReview, wrapAsync(reviewController.createReview));


// DELETE Review ROUTE
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;