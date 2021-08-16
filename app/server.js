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
app.get("/", async (req, res) => {
  let contentParagraph = `
  <div><p>  Hello and welcome to our backend project. I will allow the team to introduce
  themselves by making posts on the <a href="${config.domainName}/boards/welcome">Welcome</a> board.</p> 
  <p>This is a simple site with topic boards that contain posts created by registered users. Users can also 
  leave comments on posts.</p></div>
  `;
  let boardList = '';
  const boards = await Board.findAll().catch(err => console.log(err));
  Array.from(boards).forEach(board => {
    boardList+=`
    <div><h3><a href="${config.domainName}/boards/${board.name}">${board.name}</a></h3></div>
    <div><p>${board.description}</p></div>
    <br>
    `
  })
  const bodyStr = `
  <h1>${config.domainName}</h1>
  <hr>
  ${contentParagraph}
  <hr>
  ${boardList} 
  `
  res.render('main', {
    locals: {
      title: config.domainName,
      body: bodyStr,
      form: ''
    }
  });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/signin", (req, res) => {
  res.render("signin",{
    locals: {
      message:'', 
      domain:config.domainName 
    }
  });
});

app.get("/:errMsg/signin", (req, res) => {
  let messageStr = '';
  if (req.params.errMsg === 'nouser') {
    messageStr = 'Please enter a valid username or create an account'
  } else if (req.params.errMsg === 'nopassphrase') {
    messageStr = 'Please enter a vaild password'
  } else if (req.params.errMsg === 'noaccess') {
    messageStr = 'Please login or create an account to use the site'
  }
  res.render("signin",{
    locals: {
      message:messageStr,
      domain:config.domainName 
    }
  });
});

app.get("/boards/:boardName/post", (req, res) =>{
  res.render("makepost");
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});