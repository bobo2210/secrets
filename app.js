require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    username: String,
    password: String
});

const saltRounds = 10;

const User = mongoose.model("user",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser = new User({
            username: req.body.username,
            password: hash
        })
        newUser.save(function(err){
            if(!err){
                res.render("secrets");
            }
        })
    })
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username},function(err,foundItem){
        if(!err){
            if(foundItem){
                bcrypt.compare(password,foundItem.password,function(err,result){
                    if(result === true){
                        res.render("secrets");
                    }
                })

            }
        } else {
            console.log(err);
        }
    })
})

app.listen(3000,function(res, req){
    console.log("Server started on port 3000");
})