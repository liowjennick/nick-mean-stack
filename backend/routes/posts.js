const express = require('express');
const Post = require('../models/post');
// allow files to be uploaded
const multer = require('multer');

const router = express.Router();
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const checkAuth = require("../middleware/check-auth");

// pass a js object, 2 keys
// destination(a function that's executed when multer tries to save a file ). will return req file(file extracted) callback
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // initially no value
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");

        if (isValid) {
            error = null;
        }
        // 1st arg whether you detected error
        // 2nd arg string with path to folder it should be stored
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '-' + ext);
    }
})

// triggers middleware when there is a post request
// single - expecting a single file on image property 
// add another middleware to check for authentication
router.post("", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");

    // post request body has data
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });

    // every model created with mongoose has a save function
    // collection name is the plural of models
    post.save().then(createdPost => {
        console.log(createdPost);
        // 201 success with added resources
        // after success show json message
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    });
});

// only if request targets that path localhost /
// it will use this middleware
// query params(optional), can add to end of url separate by a ?
router.get("", (req, res, next) => {
    // name of query is up to you
    // all query are treated as string, add a plus to change it to numbers
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    // select a slice of post
    if (pageSize && currentPage) {
        postQuery   
            // mongoose provided - skip method
            // will not retrive all elements, skip the first end post
            // if you were on page 2, you will skip items(10 items) on page 1
            .skip(pageSize * (currentPage - 1))
            // limits amount of docs returned
            // not recommended for large data as it loads every data
            .limit(pageSize);
    }

    // select all post
    postQuery //returns all documents from posts
        .then((doc) => {
            fetchedPosts = doc;
            return Post.count();
        }).then(count => {
            res.status(200).json({
                message: "Posts fetch successfully",
                posts: fetchedPosts,
                maxPosts: count
            })
        });
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

router.put("/:id", checkAuth, multer({storage: storage}).single("image") ,(req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });

    // first argument which one to change 
    // second argument new object
    console.log(post);
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: 'Update successful'});
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({
            message: "Post deleted"
        });
    })

})

module.exports = router;