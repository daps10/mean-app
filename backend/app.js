const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express()

mongoose.connect("mongodb+srv://daps:"+ process.env.MONGO_ATLAS_PW +"@cluster0.nrn2f.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log("connected to database")
    })
    .catch((error) => {
        console.log("connection failed :: ", error)
    });


// Middleware for extact the json data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images", express.static(path.join("backend/images")))

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin , X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,DELETE,OPTIONS,PUT"
    );
    next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;