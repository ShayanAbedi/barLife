var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Bar         = require("../models/bar"); 

//Landing Page (ROOT ROUTE)
router.get("/",function(req,res){
    res.render("landing");
});

//Register Form Route
router.get("/register", function(req, res){
   res.render("register"); 
});

//Handling SignUp logic 
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username, 
        firstName: req.body.firstName,
        lasName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === "" ){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Barlife " + user.firstName);
           res.redirect("/bars"); 
        });
    });
});

//Login Form Route
router.get("/login", function(req, res){
   res.render("login"); 
});

//Handling Login logic 
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/bars",
        failureRedirect: "/login",
    
        failureFlash:{
            type: "error",
            message:"Invalid username or password"
        },
        successFlash:{
            type: "success",
            message:"Successfully logged in"
        }
    }));

//Logout Route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/bars");
});

//User Profiles 
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "User not exists. Please try again!");
            res.redirect("/");
            console.log("ERROR!!, Check User profile route in index.js");
        } else{
            Bar.find().where('author.id').equals(foundUser._id).exec(function(err, bars){
              if(err){
                res.redirect("/");
                console.log("ERROR!!, Check User profile route in index.js");
              }
              res.render("users/show", {user: foundUser, bars: bars});  
            });
        }
    });
});

module.exports = router;