var mongoose = require("mongoose");
var Bar = require("./models/bar");
var Comment   = require("./models/comment");

function seedDB(){
   //Remove all bars
   Bar.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed bar!");
    });
    Comment.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed comment!");
    });

}


module.exports = seedDB;
