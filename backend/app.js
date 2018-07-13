const express = require('express');

// returns us an express app, big chain of middle ware
const app = express();

// first middleware
// next will move on to the next middleware
app.use((req, res, next) => {
    console.log("First middleware");
    next();
});


app.use((req, res, next) => {
    console.log("Second middleware");
    res.send('Hello from express!');
});

module.exports = app;