const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const config = require("../config/auth.config");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  
  app.post(
    "/post/boards/:boardName/create",
    [authJwt.verifyToken],
    controller.makePost
  );

  app.post(
    "/boards/:boardName/:postId/comment",
    [authJwt.verifyToken],
    controller.makeComment
  );

  app.get(
    "/",
    controller.getHome
  );

  app.get(
    "/boards/:boardName/:postId",
    [authJwt.verifyToken],
    controller.getPost
  );

  app.get(
    '/boards/:boardName', 
    [authJwt.verifyToken],
    controller.getBoard
  );

  app.get(
    '/:errMsg/signin',
    controller.errSignin
  )

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

app.get("/post/boards/:boardName",[authJwt.verifyToken], (req, res) =>{
  res.render("makepost", {
    locals: {
      domain: config.domainName,
      boardName: req.params.boardName,
      titleValue: 'Title',
      contentValue: 'Content',
      action: `${config.domainName}/post/boards/${req.params.boardName}/create` 
    }
  });
});

app.get("/editForm/boards/:boardName/:postId",[authJwt.verifyToken], controller.editPostForm)
/*  const post = await Post.findAll({
    where: {
      id: req.params.postId
    }
  })
  .catch(err => console.log(err));

  await res.render("makepost", {
    locals: {
      domain: config.domainName,
      boardName: req.params.boardName,
      titleValue: post.title,
      contentValue: post.content,
      action: `${config.domainName}/boards/:boardName/:postId/edit` 
    }
  });*/
//});


app.post(
  "/boards/:boardName/:postId/delete", 
  [authJwt.verifyToken],
   controller.deletePost
)

app.post(
  "/boards/:boardName/:postId/edit", 
  [authJwt.verifyToken],
   controller.editPost
)
};

