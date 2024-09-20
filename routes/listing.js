const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const ListingsController = require("../controllers/listings.js")
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage })  


router.route("/")
.get(wrapAsync(ListingsController.index))  //index route
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,                
  wrapAsync(ListingsController.createListing) 
);            //Create Route

///  new route
router.get("/new",isLoggedIn,ListingsController.renderNewForm);


router.route( "/:id")
.get(wrapAsync(ListingsController.showListing))  //   show route

.put(   isLoggedIn,isOwner,
  upload.single('listing[image]'),
  validateListing, 
  wrapAsync(ListingsController.updateListing)              
) // Update route

.delete(
   isLoggedIn,isOwner,
  wrapAsync(ListingsController.destoryListing)
);// Delete route


/// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,isOwner,wrapAsync(ListingsController.renderEditForm)
);





module.exports=router;
