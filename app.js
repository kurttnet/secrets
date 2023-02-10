//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const port = 3000;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
<<<<<<< HEAD
  secret: process.env.SECRET,
=======
  secret: "",
>>>>>>> 2b66df8c19f43617e194a8fa628ec5068540da14
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if(err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });

});

app.get("/register", function(req, res) {
  res.render("register")
});

app.get("/secrets", function(req, res) {
  if(req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function(req, res) {
  req.logout(function(err) {
    if(err) {
      console.log(err)
    } else {
      res.redirect("/");
    }
  });

});

app.post("/register", function(req, res) {
  User.register({username: req.body.username}, req.body.password, function(err, user) {
    if(err) {
      console.log(err)
      res.redirect("/register")
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(port, function() {
  console.log("Server started on port " + port);
});
