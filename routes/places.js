var express    = require('express'),
    router     = express.Router(),
    Place = require('../models/place'),
    Comment    = require('../models/comment'),
    middleware = require('../middleware')

// INDEX show all places
router.get('/',(req,res)=>{
    var noMatch = null
    if(req.query.search){
        // there are several other ways and libraries to help us do this
        const regex = new RegExp(escapeRegex(req.query.search), 'gi')
        Place.find({name:regex},function(err,allPlaces){
            if(err){
                console.log(err)
            } else{
                if(allPlaces.length==0){
                    noMatch="No places match that query, please try again."
                }
                res.render('places/index',{places:allPlaces,noMatch:noMatch})
            }
        })
    }else{
        Place.find({},function(err,allPlaces){
            if(err){
                console.log(err)
            } else{
                res.render('places/index',{places:allPlaces,noMatch:noMatch})
            }
        })
    }
})

// Create - add new place to db
router.post('/',middleware.isLoggedIn,(req,res) => {
    var name=req.body.name
    var image=req.body.image
    var desc=req.body.description
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newPlace={name:name,image:image,description:desc,author:author}
    Place.create(newPlace,function(err,newlyCreated){
        if(err){
            console.log(err)
        } else{
            res.redirect('/places')
        }
    })
})

// new route
router.get('/new',middleware.isLoggedIn,(req,res) => {
    res.render('places/new')
})

// show - shows more info about place
router.get("/:id",function(req,res){
    Place.findById(req.params.id).populate('comments').exec(function(err,foundPlace){
        if(err || !foundPlace){
            req.flash('error','Place not found')
            res.redirect('back')
        } else{
            res.render('places/show',{place:foundPlace})
        }
    })
})

// EDIT place route
router.get('/:id/edit',middleware.checkPlaceOwnership,(req,res)=>{
    Place.findById(req.params.id,function(err,foundPlace){
        res.render('places/edit',{place:foundPlace})
    })
})
// UPDATE place route
router.put('/:id',middleware.checkPlaceOwnership,(req,res)=>{
    Place.findByIdAndUpdate(req.params.id,req.body.place,function(err,updatedPlace){
        if(err){
            res.redirect('/places')
        }else{
            res.redirect('/places/'+ updatedPlace._id)
        }
    })
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id',middleware.checkPlaceOwnership,(req,res)=>{
    Place.findByIdAndRemove(req.params.id,function(err,removedPlace){
        if(err){
            req.flash('error','Place not removed')
            res.redirect('/places')
        }else{
            Comment.deleteMany( {_id: { $in: removedPlace.comments } }, (err) => {
                if (err) {
                    req.flash('error','Comments not removed')
                    res.redirect('/places')
                }else{
                    req.flash('error','Place deleted')
                    res.redirect('/places')
                }
            })
        }
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports=router