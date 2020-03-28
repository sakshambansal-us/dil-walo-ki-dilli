var mongoose        = require('mongoose'),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment')

var data=[
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. In dolore exercitationem libero minima laudantium et id rerum impedit tenetur unde aspernatur animi, suscipit quas distinctio tempore aperiam facere commodi nobis!"
    },
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=347&q=80",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. In dolore exercitationem libero minima laudantium et id rerum impedit tenetur unde aspernatur animi, suscipit quas distinctio tempore aperiam facere commodi nobis!"
    },
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. In dolore exercitationem libero minima laudantium et id rerum impedit tenetur unde aspernatur animi, suscipit quas distinctio tempore aperiam facere commodi nobis!"
    }
]

function seedDB() {
    // REMOVE ALL CAMPGROUNDS
    Campground.deleteMany({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('removed campgrounds!')
            // add a few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Added a campground")
                        // create a comment
                        Comment.create(
                            {
                                text:"This place is great but I wish it had internet",
                                author:"Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err)
                                }else{
                                    campground.comments.push(comment)
                                    campground.save()
                                    console.log("Created new comment")
                                }
                            }
                        )
                    }
                })
            })
        }
    })
    // add a few comments
}

module.exports = seedDB