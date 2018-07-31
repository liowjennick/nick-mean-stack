const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

// create new user and store it in a database
router.post("/signup", (req, res, next) => {
    // second argument how many random numbers
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: "User created",
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    // find the email that matches the input
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = user;
            // compare hash value
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    messages: "Auth failed"
                })
            }
            // creates new token, 2nd arg is a secret, stored in server to validate the hash
            // 3rd arg is the property, check documentation
            const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id
            }, 
            'secret_this_should_be_longer', {
                expiresIn: "1h"
            });
            res.status(200).json({
                token: token,
                message: "Successfully logged in"
            });
        })
        .catch(err => {
            return res.status(401).json({
                messages: "Auth failed"
            })
        })
});

router.get("", (req, res, next) => {
    User.find()
        .then(result => {
            res.status(200).json({
                message: "All Users",
                users: result
            })
        })
})



// router.get("", (req, res, next) => {
//     User.find()
//         .then(result => {
//             if (result) {
//                 res.status(200).json({
//                     result: result
//                 })
//             } else {
//                 res.status(200).json({
//                     message: "No user found"
//                 })
//             }

//         })
// })

module.exports = router;
