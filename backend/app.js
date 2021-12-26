const express = require("express");
const bodyParser = require("body-parser");

const app = express()

// Middleware for extact the json data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin , X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,DELETE,OPTIONS"
    );
    next();
});

app.post("/api/posts", (req,res,next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message:"Post added successfully!"
    })
});

app.get("/api/posts", (req,res,next) => {
    const posts = [
        {
            id: "sdsd12",
            title: "First server-side post",
            content: "This is coming from the server!"
        },
        {
            id: "sdsd13",
            title: "Second server-side post",
            content: "This is coming from the server!"
        },
        {
            id: "sdsd14",
            title: "Third server-side post",
            content: "This is coming from the server!"
        },
        {
            id: "sdsd15",
            title: "Fourth server-side post",
            content: "This is coming from the server!"
        },
    ]
    res.status(200).json({
        message:"Posts fetched successfully!",
        posts:posts
    })
});

module.exports = app;