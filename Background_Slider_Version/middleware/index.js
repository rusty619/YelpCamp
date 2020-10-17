var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
        if(req.isAuthenticated()){ 
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    req.flash("error", "Campground Not Found");
                    res.redirect("back");
                } else {
                    // Does User Own The Campground? 
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error","You Don't Have Permission To Do That ");
                        res.redirect("back");
                    }
                }
            });
         } else {
            req.flash("error", "You Need To Be Logged In To Do That");
            res.redirect("back");
          }
    }


middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){ 
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                } else {
                    // Does User Own The Comment? 
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error","You Don't Have Permission To Do That");
                        res.redirect("back");
                    }
                }
            });
         } else {
             req.flash("error", "You Need To Be Logged In To Do That");
              res.redirect("back");
          }
    }

middlewareObj.isLoggedIn = function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
}

module.exports = middlewareObj;