const express = require('express');

// returns us an express app, big chain of middle ware
const app = express();

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

// only if request targets that path localhost /
// it will use this middleware
app.use('/api/posts', (req, res, next) => {
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