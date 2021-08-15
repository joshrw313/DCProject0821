const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const config = require("./config/auth.config");
const app = express();
const jwt = require("jsonwebtoken");
var corsOptions = {
  origin: "http://localhost:8081"
};

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use(express.static('public'));

app.use(cookieParser());

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

const db = require("./models");
const Role = db.role;
const User = db.user;
const RefreshToken = db.refreshToken;
const Board = db.board;
const Post = db.post;

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });

  Board.create({
    name: "welcome",
    description: "A place for new users to Introduce themselves"
  })

  User.create({
    username: "Josh",
    email: "email",
    password: "",
  })

  Post.create({
    title: "Hello My name is Josh",
    content: "My name is Josh and I am an aspiring web developer",
    userId: 1,
    boardId: 1
  })

  Post.create({
    title: "Hello My name is still Josh",
    content: "My name is Josh and I am an aspiring web developer",
    userId: 1,
    boardId: 1
  })
}

// simple route
app.get("/", (req, res) => {
  res.render('main', {
    locals: {
      title: "Home",
      body: "Hello Team",
      form: ''
    }
  });
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/signin", (req, res) => {
  res.render("signin");
});
app.get("/boards/:boardName/post", (req, res) =>{
  res.render("makepost");
})

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});