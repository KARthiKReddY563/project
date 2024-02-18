const  express = require('express')
const   router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync.js")

const { validateReview, isLoggedIn ,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controller/review.js")
  

router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
  // delete review
  
  router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))
  module.exports=router;