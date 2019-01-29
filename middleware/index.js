var Bar = require("../models/bar");
var Comment = require("../models/comment");

//All the middleware goes to this object
var middlewareObj = {};

middlewareObj.checkBarOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Bar.findById(req.params.id, function(err, foundBar){
           if(err){
               req.flash("error", "Post not found");
               res.redirect("back");
           }  else {
               //Check to see if the user own the post
            if(foundBar.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You need a permission!");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Please Log in first");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               //Check to see if the user own the comment
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You need a permission!");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Please Log in first");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Log in first");
    res.redirect("/login");
};

module.exports = middlewareObj;