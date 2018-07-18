// allow us to construct path that is safe to run on any os
const path = require("path");

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");

// returns us an express app, big chain of middle ware
const app = express();

// connect to mongodb
// connect method will return a promise
mongoose.connect('mongodb+srv://Nick:PfzELEQ3Lo873dUa@cluster0-3swpg.mongodb.net/mean?retryWrites=true',  { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection failed');
        console.error(); 
    })

app.use(bodyParser.json());

// make static image url accessible
// any request targeting the image path is allow
app.use("/images", express.static(path.join("backend/images")));

// this middleware allows cross origin resource sharing
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
})

// first argument filter for request in this url
app.use("/api/posts", postsRoutes);


module.exports = app;