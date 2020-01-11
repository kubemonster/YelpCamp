var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground"),
    Comment = require("../models/comment");

const middleware     = require("../middleware");
//:: /index/id/comments

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campdata) => {
        if (err) {
            console.log(err);
        }
        else {

            res.render("comments/new", { data: campdata });
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {

    // console.log(req.params.id);
    // console.log(req.body.comment);
    Campground.findById(req.params.id, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            //    console.log("FindByID got this \n",data);

            Comment.create(req.body.comment, (err, comdata) => {

                if (err){
                    console.log(err);
                    req.flash("error","Error on comment");
                }
                    
                else {
                    //add username and id to comment
                    //save comment

                    comdata.author.id = req.user._id;
                    comdata.author.username = req.user.username
                    comdata.save();
                    data.comments.push(comdata);
                    data.save();
                    console.log(comdata);
                    res.redirect("/index/" + data._id);
                }

            });



        }

    });

});

router.get("/:comment_id/edit",middleware.checkCommentUser,(req,res)=>{
 //   req.params.id

Comment.findById(req.params.comment_id,(err,found)=>{
    if(err)
    res.redirect("back");
    else
    res.render("comments/edit",{camp_id:req.params.id,data:found});
});
 



});
router.put("/:comment_id",middleware.checkCommentUser,(req,res)=>{

    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,foundCom)=>{
        if(err)
        res.redirect("back");
        else
        {   
        res.redirect("/index/"+req.params.id);
         }

    })
    });
    
router.delete("/:comment_id",middleware.checkCommentUser,(req,res)=>{

        Comment.findByIdAndDelete(req.params.comment_id,(err,foundCom)=>{
            if(err)
            res.redirect("back");
            else
            { 
                
            req.flash("success","Comment Deleted");
            res.redirect("/index/"+req.params.id);
             }
    
        })
});



// function checkCommentUser(req,res,next){
    
//     if(req.isAuthenticated())
//     {
    
//         Comment.findById(req.params.comment_id,(err,foundComment)=>{

//             if(err)
//             res.redirect("back");
//             else
//             {
              
//                if(foundComment.author.id.equals(req.user._id))
//                {
//                     next();
//                }
//                else
//                {
//                 res.redirect("back");
//                }
//             }
            
//         });
      
//     }
//     else{
        
//         res.redirect("back");
//     }
  

// }


// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;