const Listing = require("../models/listing");
const mbxGeooding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeooding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }


  module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");
  }

  module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send()
     
    const newListing = new Listing(req.body.listing);
    const url = req.file.path;
    const filename = req.file.filename;
    
    newListing.owner=req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry
   let savedListing = await newListing.save();
   console.log(savedListing);
   
    req.flash('success', "New Listing Created");
    res.redirect("/listings");
    // console.log(newListing);
  }


  module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
      .populate("owner");
      // console.log(listing)
    if(!listing)
    {
      req.flash('error', "Listing you requested for does not exist!");
      return res.redirect('/listings');
    }

    res.render("listings/show.ejs", { listing });

    //    console.log(listing);
  }


  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if(!listing)
      {
        req.flash('error', "Listing you requested for does not exist!");
        return res.redirect('/listings');
      }
    let orignal_image_url = listing.image.url;
    orignal_image_url = orignal_image_url.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing,orignal_image_url });
  }


  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file !=="undefined"){
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image={url,filename}
    await listing.save();
   }
    req.flash('success', "Listing Updated ");
    res.redirect(`/listings/${id}`);
  }


  module.exports.destoryListing = async (req, res) => {
    let { id } = req.params;
    const deleteList = await Listing.findByIdAndDelete(id);
    req.flash('success', "Listing Deleted");
    res.redirect("/listings");
  }