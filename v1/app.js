var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.get("/", function(req, res){
    res.render("landing");
});

var campgrounds = [
    {name: "Salmon Creek", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440722e79d4924ac6_340.jpg"},
    {name: "Granite Hill", image: "https://pixabay.com/get/53e2dc4b4d54a514f1dc84609620367d1c3ed9e04e507440722e79d4924ac6_340.jpg"},
    {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e507440722e79d4924ac6_340.jpg"}
];

app.get("/campgrounds", function(req, res){
    res.render("camping",{campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    // get data form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});

app.listen(8080, function(){
    console.log("The YelpCamp Server Has Started");
});