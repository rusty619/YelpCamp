var express     = require('express');
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useUnifiedTopology: true,useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// campground.create({
//     name: "Granite Hill", 
//     image: "https://d2g85s3tfaxbly.cloudfront.net/wp/wp-content/uploads/2018/06/Belle_005.jpg",
//     description: "This a huge Granite Hill, No Water, No Bathroom"
// }, function(err, campground){
//      if(err){
//         console.log(err);
//      } else {
//          console.log("NEWLY CREATED CAMPGROUND: ");
//          console.log(campground);
//      }
// });

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440722e79d4924ac6_340.jpg"},
//     {name: "Granite Hill", image: "https://pixabay.com/get/53e2dc4b4d54a514f1dc84609620367d1c3ed9e04e507440722e79d4924ac6_340.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e507440722e79d4924ac6_340.jpg"}
// ];

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX ROUTE--- SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res){
    // GET ALL CAMPGROUNDS FROM DB
    Campground.find({},function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index",{campgrounds:allcampgrounds});
        }
    });
    
});

// CREATE - add new campgrounds to DB
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});

//SHOW - shows more infor about one campground
app.get("/campgrounds/:id", function(req, res){
    //FIND THE CAMPGROUND WITH PROVIDE ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
    
});

app.listen(8080, function(){
    console.log("The YelpCamp Server Has Started");
});