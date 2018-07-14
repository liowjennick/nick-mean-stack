const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

// returns us an express app, big chain of middle ware
const app = express();

// connect to mongodb
// connect method will return a promise
mongoose.connect('mongodb+srv://Nick:PfzELEQ3Lo873dUa@cluster0-3swpg.mongodb.net/mean?retryWrites=true',  { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.logo('Connection failed');
    })

app.use(bodyParser.json());

// this middleware allows cross origin resource sharing
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
})

// triggers middleware when there is a post request
app.post("/api/posts", (req, res, next) => {

    // post request body has data
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    // every model created with mongoose has a save function
    // collection name is the plural of models
    post.save();

    console.log(post);

    // 201 success with added resources
    // after success show json message
    res.status(201).json({
        message: 'Post added successfully'
    });
});

// only if request targets that path localhost /
// it will use this middleware
app.get('/api/posts', (req, res, next) => {
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

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({
            message: "Post deleted"
        });
    })

})

module.exports = app;