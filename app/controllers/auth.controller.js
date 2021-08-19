const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.set({ message: "User was registered successfully!" });
          res.redirect(`${config.domainName}/signin`);
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(async (user) => {
      if (!user) {
        res.redirect(`${config.domainName}/nouser/signin`);
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        res.redirect(`${config.domainName}/nopassphrase/signin`);
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        config.signupOrUsername = `${user.username}`;
        config.loginOrLogout = `<a href="${config.domainName}/logout">Logout</a>`;
        res.cookie('jwt', {'token':token,'refreshToken':refreshToken}, {expires: new Date(Date.now()+(60*1000*60*60*2))});
        res.redirect(`${config.domainName}/`);
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    console.log(refreshToken)

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.googleSignIn = (req, res)=>{
    console.log('redirected', req.user)
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
        res.redirect('https://dcproject0821.xyz/api/auth/google');

       }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);
      
        
        /*res.set({
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token,
          refreshToken: refreshToken,
        });*/
        //res.cookie('jwt', {'token':token,'refreshToken':refreshToken});
        //config.signupOrUsername = `${user.username}`;
        //config.loginOrLogout = `<a href="${config.domainName}/logout">Logout</a>`;
        res.cookie('jwt', {'token':token,'refreshToken':refreshToken}, {expires: new Date(Date.now()+(60*1000*60*60*2))});
        res.redirect(`${config.domainName}/`);
        
      })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout = (req, res) => {
    res.cookie('jwt', {'token':'', 'refreshToken':''}, {expires: new Date(Date.now())});
    config.signupOrUsername = `<a href="${config.domainName}/signup">Signup</a>`,
    config.loginOrLogout = `<a href="${config.domainName}/signin">Login</a>`
    res.redirect(`${config.domainName}`);
}
