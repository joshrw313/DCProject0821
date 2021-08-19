const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function(app) {
// const googleKey = require("../config/google.Oauth");

passport.use(new GoogleStrategy({
	  clientID: "googleKey.clientId", 
	  clientSecret: "googleKey.clientSecret", 
    callbackURL: "https://dcproject0821.xyz/api/auth/googleRedirect"
  },
  function(accessToken, refreshToken, profile, done) {
      //console.log(accessToken, refreshToken, profile)
      console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
      return done(null, profile)
  }
));

passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user)
})
passport.deserializeUser(function(obj, done) {
    console.log(deserialize);
    done(null, obj)
})

  app.use(passport.initialize());
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
  app.get('/api/auth/google',  passport.authenticate('google', { scope: ['profile','email'] }));
  app.get('/api/auth/googleRedirect', passport.authenticate('google'), controller.googleSignIn);
  app.get('/logout', controller.logout); 
};
