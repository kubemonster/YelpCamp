var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    path        = require('path'),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    methodOveride = require("method-override");
    

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true,  useUnifiedTopology: true });

//mongoose.Promise = global.Promise;
const databaseUri = "mongodb://kyubee08:sexsexsex@yelpcamp-uat8f.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(databaseUri, {useUnifiedTopology: true,useNewUrlParser: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));




var Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    seedDB              = require("./seed"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    User                = require("./models/user");


var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

    
    //seedDB();//no seeding

///====================
//  Passport config
///====================


app.use(require("express-session")({

    secret:"Jai kali Maa",
    resave: false,
    saveUninitialized: false

}));


app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{

    res.locals.currUser = req.user;
    res.locals.error  = req.flash("error");
    res.locals.success  = req.flash("success");
    next();
});
app.use(methodOveride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use("/",indexRoutes);
app.use("/index",campgroundRoutes);
app.use("/index/:id/comments",commentRoutes);





app.listen(process.env.PORT,process.env.IP);