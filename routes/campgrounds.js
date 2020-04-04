var express    = require('express'),
    router     = express.Router(),
    Campground = require('../models/campground'),
    Comment    = require('../models/comment'),
    middleware = require('../middleware')

// INDEX show all campgrounds
router.get('/',(req,res)=>{
    var noMatch = null
    if(req.query.search){
        // there are several other ways and libraries to help us do this
        const regex = new RegExp(escapeRegex(req.query.search), 'gi')
        Campground.find({name:regex},function(err,allCampgrounds){
            if(err){
                console.log(err)
            } else{
                if(allCampgrounds.length==0){
                    noMatch="No campgrounds match that query, please try again."
                }
                res.render('campgrounds/index',{campgrounds:allCampgrounds,noMatch:noMatch})
            }
        })
    }else{
        Campground.find({},function(err,allCampgrounds){
            if(err){
                console.log(err)
            } else{
                res.render('campgrounds/index',{campgrounds:allCampgrounds,noMatch:noMatch})
            }
        })
    }
})

// Create - add new campground to db
router.post('/',middleware.isLoggedIn,(req,res) => {
    var name=req.body.name
    var price= req.body.price
    var image=req.body.image
    var desc=req.body.description
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name,price:price,image:image,description:desc,author:author}
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err)
        } else{
            res.redirect('/campgrounds')
        }
    })
})

// new route
router.get('/new',middleware.isLoggedIn,(req,res) => {
    res.render('campgrounds/new')
})

// show - shows more info about campground
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
        if(err){
            console.log(err)
        } else{
            res.render('campgrounds/show',{campground:foundCampground})
        }
    })
})

// EDIT campground route
router.get('/:id/edit',middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render('campgrounds/edit',{campground:foundCampground})
    })
})
// UPDATE campground route
router.put('/:id',middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds/'+ updatedCampground._id)
        }
    })
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id',middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds')
        }
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports=router