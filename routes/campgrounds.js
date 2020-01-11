var express = require("express");
var router  = express.Router();
var Campground       = require("../models/campground"),
    Comment          = require("../models/comment");
    
const middleware     = require("../middleware");


router.get('/',(req,res)=>{
    console.log(req.user);
    //get all campgrounds form db
    Campground.find({},(err,allCamps)=>
    {
        if(err){
            console.log(err);
        }
        else 
        {
            res.render("campgrounds/index",{data:allCamps});

        }
        

    });
    //res.render("campgrounds",{data:allCamps});
    });




 router.post('/',middleware.isLoggedIn,(req,res)=>{

    var name = req.body.name;  
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author  = {
        id:req.user._id,
        username:req.user.username

    };

    var newCG = {name :name,price:price,image :image,description :description,author:author};
    console.log(req.user);
 //create a new campground and save to database
    Campground.create(newCG,(err,newCreated)=>
                        {
                            console.log(newCreated);
                            if(err)
                            console.log(err);
                            else
                            res.redirect("/index");
                            
                        });

   

        });

router.get('/new',middleware.isLoggedIn,(req,res)=>{

    res.render("campgrounds/new");
    });



router.get('/:id',(req,res)=>{
//find the campground with the id and show it
Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{    
    if(err)
    console.log(err);
    else
    res.render("campgrounds/show",{data:foundCampground});
});
    
});
//////////////////////
/// EDIT
/////////////////////


router.get("/:id/edit",middleware.checkCampgroundUser,(req,res)=>{
   
        
  Campground.findById(req.params.id,(err,foundCampground)=>{

            if(err)
            res.redirect("/index");
            else
            {
                res.render("campgrounds/edit",{data:foundCampground}); 
            }

        });
    
});




//////////////////////
/// UPDATE
/////////////////////


router.put("/:id",middleware.checkCampgroundUser,(req,res)=>{

   

    Campground.findByIdAndUpdate(req.params.id,req.body.data,(err,updatedCamp)=>{
       console.log(updatedCamp);
        if(err)
        {
            res.redirect("/index");
        }
        else
        {
            res.redirect("/index/"+req.params.id);
        }

    });


});


//destroy campground

router.delete("/:id",middleware.checkCampgroundUser,(req,res)=>{

    Campground.findByIdAndDelete(req.params.id,err=>{
        if(err)
        console.log(err);
        else
        {
            res.redirect("/index")
;        }
    });

});


// function checkCampgroundUser(req,res,next){
    
//     if(req.isAuthenticated())
//     {
    
//         Campground.findById(req.params.id,(err,foundCampground)=>{

//             if(err)
//             res.redirect("/index");
//             else
//             {
//                if(foundCampground.author.id.equals(req.user._id))
//                {
//                     next();
//                }
//                else
//                {
//                    res.redirect("back");
//                }
//             }
            
//         });
      
//     }
//     else{
        
//         res.redirect("back");
//     }
  
  
// }



// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

 module.exports = router;