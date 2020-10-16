var express     = require('express'),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    User        = require("./models/user")

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
    
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", {useUnifiedTopology: true,useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();   

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "YOU FOUND THE LINK!!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser: req.user});
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
    res.render("campgrounds/new");
});

//SHOW - shows more infor about one campground
app.get("/campgrounds/:id", function(req, res){
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

// =============================
// COMMENTS ROUTES
// =============================

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

//==============
// AUTH ROUTES
//==============

// SHOW REGISTER FORM
app.get("/register", function(req, res){
   res.render("register");
});
// Handle Sign Up Logic
app.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
       });
   });
});

// Show Login Form
app.get("/login", function(req, res){
    res.render("login");
});
// Handling in Login Logic
app.post("/login",passport.authenticate("local",
  {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
  }), function(req, res){
    
});

// logic route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(8080, function(){
    console.log("The YelpCamp Server Has Started");
});