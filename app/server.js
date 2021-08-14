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
    name: "test",
    description: "test"
  })

}

// simple route
app.get("/", (req, res) => {
  res.render('main');
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/signin", (req, res) => {
  res.render("signin");
});
app.get('/:boardName', (req,res) => {
  const {boardName} = req.params;
  const board = Board.findOne({
    where: {
      name: boardName
    }
  });
  let contentStr = '';
  // What if there is no post on that board?
  Post.findAll({
    where: {
      boardId: board.id
    },
    order: [
      ['id', 'desc']
    ]
  })
  .then(posts => {
    Array.from(posts).forEach(post => {
      let user = User.findOne({
        where: {
          id : post.userId
        }
      });
      contentStr+=` 
      <div><p><a href="#">${post.title}</a> | by: ${user.username}</p></div>
      `
    });
    let content = {
      title: board.name,
      body: contentStr
    }
    return content  
    })
    .then(content => {
      res.render('main', {
        locals: {
          title: content.title,
          body: content.body
        }
      })
    })
  })

app.get("/post", (req, res) =>{
  //res.cookie('board', {'board':req.params.board});
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