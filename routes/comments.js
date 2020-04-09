var express    = require('express'),
    router     = express.Router({mergeParams:true}),
    Place = require('../models/place'),
    Comment    = require('../models/comment'),
    middleware = require('../middleware')

// Comments New
router.get('/new',middleware.isLoggedIn,function(req,res){
    Place.findById(req.params.id,function(err, place){
        if(err){
            console.log(err)
        }else{
            res.render('comments/new',{place:place})
        }
    })
})

// Comments Create
router.post('/',middleware.isLoggedIn,(req,res) => {
    // lookup place using ID
    Place.findById(req.params.id,function(err,place){
        if(err){
            req.flash('error','Something went wrong')
            res.redirect('/places')
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    // add username and id to comment
                    comment.author.id=req.user._id
                    comment.author.username=req.user.username
                    // save comment
                    comment.save()
                    place.comments.push(comment)
                    place.save(function(err,comment){
                        if(err){
                            console.log(err)
                        }else{
                            req.flash('success','Successfully added comment')
                            res.redirect('/places/' + place._id)
                        }
                    })
                }
            })
        }
    })
    // create new comment
    // connect new comment to place
    // redirect to place show page
})

// COMMENT EDIT ROUTE
router.get('/:comment_id/edit',middleware.checkCommentOwnership,function(req,res){
    Place.findById(req.params.id,function(err,foundPlace){
        if(err || !foundPlace){
            req.flash('error','Place not found')
            return res.redirect('back')
        }
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect('back')
            }else{
                res.render('comments/edit',{place_id:req.params.id,comment:foundComment})
            }
        })
    })
})

// COMMENT UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect('back')
        } else {
            res.redirect('/places/' + req.params.id)
        }
    })
})

// COMMENT DESTROY ROUTE
router.delete('/:comment_id',middleware.checkCommentOwnership,function(req,res){
    // findByIdAndDelete
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect('back')
        }else{
            req.flash('success','Comment deleted')
            res.redirect('/places/'+req.params.id)
        }
    })
})

module.exports=router