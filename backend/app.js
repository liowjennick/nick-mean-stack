const express = require('express');
const bodyParser = require('body-parser');

// returns us an express app, big chain of middle ware
const app = express();

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
    const post = req.body;
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
    const posts = [
        { 
            id: 'dashkj123', 
            title: 'First Server', 
            content: 'Coming from the server'
        },
        { 
            id: 'qwerkj123', 
            title: 'Second Server', 
            content: ' 2ndComing from the server'
        }
    ];
    // send back json data
    res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: posts
    });
        
});

module.exports = app;