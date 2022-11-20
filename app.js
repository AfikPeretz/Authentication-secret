//jshint esversion:6
require ('dotenv').config();
const express = require('express');
const bodyParser = require ('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    userName: {type : String , unique : true},
    password: String
});


const User = new mongoose.model('User', userSchema);


app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user = new User({
            userName: req.body.username,
            password: hash
        });
        user.save(function(err){
            if (err){
                res.send(err);
            } else {
                res.redirect('/login');
            }
        });
    });
    
});

app.post('/login', function(req, res){
    User.findOne({userName: req.body.username}, function(err, result){
        if (!err){
            if (result){
                bcrypt.compare(req.body.password, result.password, function(err, bcryptRes) {
                    if (bcryptRes === true){
                        res.render('secrets');
                    } else {
                        res.send("Wrong password, try again!");
                        res.redirect('/login');
                    }
                });
            }
            else{
                res.send("There is no such user");
            }
        } else {
            res.send(err);
        }
    });
});




app.listen(3000, function() {
    console.log("Server started on port 3000");
});