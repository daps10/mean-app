const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const user = require("../models/user");
const router = express.Router()

router.post("/signup", (req,res,next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const User = new user({
                name:req.body.name, 
                email:req.body.email, 
                password:hash
            });
            User
                .save()
                .then(result => {
                    res.status(201).json({
                        message:"User created!",
                        result:result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message:"Invalid authentication credentials!"
                    })
                }) 
        });
})

router.post("/login", (req,res,next) => {
    let fetchedUser;
    user.findOne({ email: req.body.email })
        .then(user => {
        if(!user) {
            return res.status(401).json({
                message: "Auth failed!"
            });
        }   
        // store user response in fetchedUser
        fetchedUser= user;
        // compare the password
        return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
        if(!result) {
            return res.status(401).json({
                message: "Auth failed!"
            });
        }

        // create new web token 
        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            "secret_this_should_be_longer",
            { expiresIn: "1h" }
        );
        
        res.status(200).json({
            token:token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    })
    .catch(err => {
        return res.status(401).json({
            message: "Invalid authentication credentials!"
        });
    })
})


router.post("/autocomplete", (req, res) => {
    user.aggregate([
        {
            $search: {
                "autocomplete": {
                    "path": "name",
                    "query": req.body.name,
                    "tokenOrder": "any",
                    "fuzzy": {
                        "maxEdits": 1,
                        "prefixLength": 1,
                        "maxExpansions": 256
                    }
                }
            }
        },
        {
            $limit: 10
        }
    ])
    .then(user => {
        res.status(200).json({
            data:user
        })
    }).catch(err => {
        return res.status(401).json({
            message: "Not Found!"
        });
    });
})

module.exports = router;