var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User    = require("../models/user");




router.get('/',(req,res)=>{
    res.render("landing");
    });
    
router.get("/register",(req, res)=>{
    res.render("register");
});

router.post("/register",(req, res)=>{
    var newUser = new User({username:req.body.username });
    var password = req.body.password;
    User.register(newUser,password,(err,user)=>{
        if(err)
        {
         req.flash("error",err.message);
         console.log(err);
         res.redirect("/register");
        }
        passport.authenticate('local')(req,res,()=>{
            req.flash("success","Welcome to YelpCamp"+user.username);
                res.redirect("/index");
        });

    });
});

//=================
//  Login
//=================

router.get("/login",(req,res)=>{

    res.render("login");

});


router.post("/login",passport.authenticate("local",{
    successRedirect:"/index",
    failureRedirect:"/login"

}),(req,res)=>{});


//=================
//  Logout
//=================

router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged you out!!")
    res.redirect("/index");

})






module.exports = router;