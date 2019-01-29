var express    = require("express"),
    router     = express.Router(),
    Bar        = require("../models/bar"),
    middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


//INDEX ROUTE - Show all bars
router.get("/", function(req, res){
    //Search query for the Search bar
    if(req.query.search){
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //Find the searched query
        Bar.find({name: regex},function(err, bars){
            if(err){
            console.log("ERROR!!, Check FuzzySearch on Index route");
            }
            else{
            res.render("bars/index",{bars: bars});
            }
        });
    } else{
    //Get all bar posts from DB
    Bar.find({}, function(err, allBars){
        if(err){
            console.log(err);
            console.log("ERROR!!, Check Show route in bars.js");
        } else{
            res.render("bars/index", {bars: allBars});
        }
    });
    }
});

//CREATE ROUTE - add new bar to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to bars array
  var name = req.body.name;
  var image = req.body.image;
  var text = req.body.text;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newBar = {name: name, image: image, text: text, author:author, location: location, lat: lat, lng: lng};
    // Create a new bar and save to DB
    Bar.create(newBar, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to bars page
            console.log(newlyCreated);
            res.redirect("/bars");
        }
    });
  });
});

//NEW ROUTE - show the form for creating new post
router.get("/new",middleware.isLoggedIn, function(req, res) {
   res.render("bars/new"); 
});

//SHOW ROUTE - shows more information about one specific bar post
router.get("/:id", function(req, res) {
    //find the bar with provided ID
    Bar.findById(req.params.id).populate("comments").exec(function(err, foundBar){
        if(err){
            console.log(err);
            console.log("ERROR!!, Check Show route in bars.js");
        } else{
            console.log(foundBar);
           //render show template assoziated with that bar
           res.render("bars/show", {bar: foundBar});
        }
    });
});


//EDIT ROUTE - show the edit form for the selected bar post
router.get("/:id/edit", middleware.checkBarOwnership, function(req, res) {
    Bar.findById(req.params.id, function(err, foundBar){
        res.render("bars/edit", {bar: foundBar});
    });
});


//UPDATE ROUTE - update the selected bar post
router.put("/:id", middleware.checkBarOwnership, function(req, res){
    geocoder.geocode(req.body.location, function(err, data){
      if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.bar.lat = data[0].latitude;
    req.body.bar.lng = data[0].longitude;
    req.body.bar.location = data[0].formattedAddress;
    
    //find and update the selected bar post   
    Bar.findByIdAndUpdate(req.params.id, req.body.bar, function(err, updatedBar){
        if(err){
            res.redirect("/bars");
        } else {
            //redirect to the show page
            res.redirect("/bars/" + req.params.id);
        }
      });
    });
});

//DESTROY ROUTE - deelete a specific post 
router.delete("/:id", middleware.checkBarOwnership, function(req,res){
    Bar.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/bars");
        } else{
            res.redirect("/bars");
        }
    });
});

//Function use for doing a FuzzySearch
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
} 
module.exports = router;