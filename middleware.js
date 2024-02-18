const Listing=require("./models/listing");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema ,reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
 
    if(!req.isAuthenticated()){
      //redirect url
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create Listing");
       return res.redirect("/login");

     }
     next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if( req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
  
  }
 next();
}
module.exports.isOwner= async (req,res,next)=>{
  let {id} = req.params;
 let listing=await  Listing.findById(id)
 if(!listing.owner._id.equals(res.locals.currUser._id)){
   req.flash("error","you dont have access to edit");
  return  res.redirect(`/listings/${id}`);
 }
 next();
}

module.exports.isReviewAuthor= async (req,res,next)=>{
  let {id,reviewId} = req.params;
 let review=await  Review.findById(reviewId)
 if(!review.author.equals(res.locals.currUser._id)){
   req.flash("error","you dont have access to edit delete");
  return  res.redirect(`/listings/${id}`);
 }
 next();
}






module.exports.validateListing=(req,res,next)=>{
  let url =req.body.listing.image;
  console.log(url);
  let filename ="listingimage";
  req.body.listing.image ={url,filename};
    let {error} =listingSchema.validate(req.body);
  
    if(error)
    {
      let errMsg=error.details.map((el)=> el.message).join(",");
     throw new ExpressError(400,error);
    }
    else {
      next();
    }
  }
  module.exports.validateReview=(req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
  
    if(error)
    {
      let errMsg=error.details.map((el)=> el.message).join(",");
     throw new ExpressError(400,error);
    }
    else {
      next();
    }
  }