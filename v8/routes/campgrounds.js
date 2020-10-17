var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")

//INDEX ROUTE--- SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
    // GET ALL CAMPGROUNDS FROM DB
    Campground.find({},function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser: req.user});
        }
    });
    
});

// CREATE - add new campgrounds to DB
router.post("/",isLoggedIn,function(req, res){
    // get data form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // CREATE A NEW CAMPGROUND AND SAVE TO DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
             // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    }); 
})

//NEW - show form to create new campground
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

//SHOW - shows more infor about one campground
router.get("/:id", function(req, res){
    //FIND THE CAMPGROUND WITH PROVIDE ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
});

//MiddleWare
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;