const express = require("express");
const cors = require("cors");

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use(express.static('public'));

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const client = require('./config/google.Oauth.js');
console.log(client);

passport.use(new GoogleStrategy({
	  clientID: "1011376484214-mv7mbq2n4cngg6p9lkvbfosoh49jc0pv.apps.googleusercontent.com",
	  clientSecret: "PWrMsjFXVJIrW9JW8A4i7dUA",
    callbackURL: "http://localhost:8080/api/auth/googleRedirect"
  },
  function(accessToken, refreshToken, profile, done) {
      //console.log(accessToken, refreshToken, profile)
      console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
      return done(null, profile)
  }
))

app.get('/api/auth/google',  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('api/auth/googleRedirect', passport.authenticate('google'),(req, res)=>{
    console.log('redirected', req.user)
    /*let user = {
        displayName: req.user.displayName,
        name: req.user.name.givenName,
        email: req.user._json.email,
        provider: req.user.provider }
    console.log(user)
   */ 
  User.findOne({
    where: {
      username: req.user.displayName
    }
  })
  .then(async (user) => {
      if (!user) {
        User.create({
          username: req.user.displayName,
          email: req.user._json.email,
          password: null,
          provider: req.user.provider 
        })
        res.status(200).send('User registered sucessfully').redirect('/api/auth/google');

       }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);
      
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token,
          refreshToken: refreshToken,
        });
      })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});


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
}

// simple route
app.get("/", (req, res) => {
  res.render('main');
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
