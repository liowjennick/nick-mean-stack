const express = require('express');
const Post = require('../models/post');

const router = express.Router();

// triggers middleware when there is a post request
router.post("", (req, res, next) => {

    // post request body has data
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    // every model created with mongoose has a save function
    // collection name is the plural of models
    post.save().then(result => {
        console.log(result);
        // 201 success with added resources
        // after success show json message
        res.status(201).json({
            message: 'Post added successfully',
            postId: result._id
        });
    });
});

// only if request targets that path localhost /
// it will use this middleware
router.get("", (req, res, next) => {
    Post.find() //returns all documents from posts
        .then((doc) => {
            // send back json data
            res.status(200).json({
                message: 'Posts fetched succesfully',
                posts: doc
            });
            console.log(doc);
        })   
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    });
});

// patch will update the field only 
// put will replace the entire thing

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });

    // first argument which one to change 
    // second argument new object
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: 'Update successful'});
    });
});

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({
            message: "Post deleted"
        });
    })

})

module.exports = router;