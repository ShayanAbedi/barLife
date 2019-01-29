var mongoose = require("mongoose");

var barSchema = new mongoose.Schema({
    name: String,
    image: String,
    text: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt : { type : Date, default: Date.now },
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});
module.exports = mongoose.model("Bar", barSchema);
