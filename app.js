//Requiring the installed packages
require('dotenv').config();
var   express          = require('express'),
      bodyParser       = require('body-parser'),
      flash            = require('connect-flash'),
      methodOverride   = require('method-override'),
      mongoose         = require('mongoose'),
      passport         = require('passport'),
      LocalStrategy    = require('passport-local'),
      app              = express(),
      seedDB           = require("./seed");


//Requiring the models
var Bar     = require("./models/bar"),
    Comment = require("./models/comment"),
    User    = require("./models/user");

//Requiring the routes
var    barRoutes     = require("./routes/bars");
var    commentRoutes = require("./routes/comments");
var    indexRoutes   = require("./routes/index");

//Connecting to DB
mongoose.connect('mongodb://localhost/barlife', {useNewUrlParser: true});


//App config
app.use(bodyParser.urlencoded({extended: true})); //use in order to be able to capture data coming via a form
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method")); //override with POST having ?_method=DELETE or PUT
app.use(flash());
// seedDB(); //seed the database

app.locals.moment = require('moment');

//Passport Config
app.use(require("express-session")({
      secret: "Barlife is a place for bar/pub lovers",
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
      res.locals.error = req.flash("error");
      res.locals.success = req.flash("success");
      next(); 
});


app.use("/bars", barRoutes);
app.use("/bars/:id/comments", commentRoutes);
app.use("/", indexRoutes);


app.listen(process.env.PORT, process.env.ID,
      function(){
            console.log("Server Started");
});

