var mongoose        = require('mongoose'),
    Place      = require('./models/place'),
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
    Place.deleteMany({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('removed places!')
            // add a few places
            data.forEach(function (seed) {
                Place.create(seed, function (err, place) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Added a place")
                        // create a comment
                        Comment.create(
                            {
                                text:"This place is great but I wish it had internet",
                                author:"Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err)
                                }else{
                                    place.comments.push(comment)
                                    place.save()
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