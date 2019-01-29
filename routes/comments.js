var express = require("express");
var router  = express.Router({mergeParams: true});
var Bar = require("../models/bar");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find bar post by id
    console.log(req.params.id);
    Bar.findById(req.params.id, function(err, bar){
        if(err){
            console.log("ERROR!!, Check NEW route in comments.js ");
            console.log(err);
        } else{
            res.render("comments/new", {bar: bar});
        }
    });
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup Bar post using ID
    Bar.findById(req.params.id, function(err, bar){
        if(err){
            console.log("ERROR!!, Check CREATE route/<1ST IF> in comments.js ");
            console.log(err);
            res.redirect("/bars");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!");
                    console.log("ERROR!!, Check CREATE route//<2nd IF> in comments.js");
                    console.log(err);
                }else{
                    //add username and id to comment 
                    comment.author.id       = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment 
                    comment.save();
                    bar.comments.push(comment);
                    bar.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect('/bars/' + bar._id);
                }
            });
            
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            console.log("ERROR! Check EDIT route in comments.js");
            res.redirect("back");
        } else{
            res.render("comments/edit", {bar_id: req.params.id, comment: foundComment});
        }
    });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/bars/" + req.params.id );
      }
   });
});

//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/bars/" + req.params.id);
       }
    });
});

module.exports = router;