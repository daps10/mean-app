const express = require("express");

const app = express()

app.use("/api/posts", (req,res,next) => {
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