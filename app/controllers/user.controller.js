const db = require("../models");
const {post: Post, comment: Comment, board: Board, user: User} = db;
const config = require("../config/auth.config");
const { Op } = require("sequelize");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.makePost = async (req, res) => {
const board = await Board.findOne({
   where: {
     name: req.params.boardName
   }
 });
 
const post = await  Post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.userId,
    boardId: board.id
  });
   await res.redirect(`${config.domainName}/boards/${req.params.boardName}/${post.id}`);
}

exports.makeComment = async (req, res) => {
  await Comment.create({
    content: req.body.content,
    userId: req.userId,
    postId: req.params.postId
  });
  await res.redirect(`${config.domainName}/boards/${req.params.boardName}/${req.params.postId}`);
};

exports.getPost = async (req, res) => {
  try {
  let buttons = {
    signupOrUsername: config.signupOrUsername,
    loginOrLogout: config.loginOrLogout
  };
  if (req.cookies['jwt'] && req.cookies['jwt'].username) {
    buttons.signupOrUsername = `<a class="nav-link" href="#">${req.cookies['jwt'].username}</a>`,
    buttons.loginOrLogout = `<a class="nav-link" href="/logout">Logout</a>`
  }
   const post = await Post.findOne({
     where: {
       id: req.params.postId
     }
   })
   .catch(err => console.log(err));

   const comments = await Comment.findAll({
     where:{
       postId: post.id
     },
     include: User
   })
   .catch(err => console.log(err));
  
   let deleteButton = '';
   let editLink = '';
   if (req.userId && req.userId == post.userId) {
     deleteButton = `
    <form id="delete" action="${config.domainName}/boards/${req.params.boardName}/${req.params.postId}/delete" method="post">
    <button class="btn btn-link" id="delete" type="submit">Delete</button>
     </form> 
     `
     editLink =  `
    <button class="btn btn-link" ><a href="${config.domainName}/editForm/boards/${req.params.boardName}/${req.params.postId}">Edit</a></button>
     `
   };
   let commentStr = '<b>Comments</b>';
   comments.forEach(comment => {
   commentStr+=` 
      <div><p> ${comment.content} | ${comment.createdAt} | by: ${comment.user.username}</p></div>
      `
   });
   const board = await Board.findOne({
        where: {
          name: req.params.boardName
        }
   })
   .catch(err => console.log(err));
   let postStr = `
      <div><p> ${post.content} </p></div>
   `;
   const content = {
     title: post.title,
     body: `<hr><b><a href="${config.domainName}/boards/${req.params.boardName}">${req.params.boardName}</a></b></span> - ${board.description}</span>
     <hr><nav class="navbar navbar-dark"><b>${post.title}</b><div>${editLink}</div><div>${deleteButton}</div></nav><hr> ${postStr} <hr>${commentStr}<hr>`
   }
   res.render('main', {
    locals: {
      title: config.domainName,
      body: content.body,
      postid: post.id,
      signup: buttons.signupOrUsername,
      login: buttons.loginOrLogout
    },
    partials: {
      head: '../partials/head',
      form: '../partials/makecomment'
    }
  })} catch (e) {
    res.status(404);
      res.render('main', {
        locals: {
          title: config.domainName,
          body: `<h1>404 Nothing Here</h1>`,
          form: '',
          signup: '',
          login: '' 
        },
        partials: {
          head: '../partials/head',
        }
      })
    }
  };

  exports.getBoard = async (req,res) => {
  let buttons = {
    signupOrUsername: config.signupOrUsername,
    loginOrLogout: config.loginOrLogout
  };
  if (req.cookies['jwt'] && req.cookies['jwt'].username) {
    buttons.signupOrUsername = `<a class="nav-link" href="#">${req.cookies['jwt'].username}</a>`,
    buttons.loginOrLogout = `<a class="nav-link" href="/logout">Logout</a>`
  }
  const {boardName} = req.params;
  let contentStr = '';
  const board = await Board.findOne({
    where: {
      name: boardName
    }
  }).catch(err => {
    res.status(404).send(err);
  })

  try {
  Post.findAll({
    where: {
      boardId: board.id
    },
    order: [
      ['id', 'desc']
    ],
    include: User 
  })
  .then(posts => {
    Array.from(posts).forEach(post => {
      contentStr+=` 
      <div><p><a href="${config.domainName}/boards/${req.params.boardName}/${post.id}">${post.title}</a> | at: ${post.updatedAt} | by: ${post.user.username}</p></div>
      `
    });
    let content = {
      title: board.name,
      body: `
      <div>${contentStr}</div>
      <a href="${config.domainName}/post/boards/${req.params.boardName}">Create Post</a> 
      `
    }
    return content  
    })
    .then(content => {
      res.render('main', {
        locals: {
          title: config.domainName,
          body: `<hr><h3>${content.title}</h3><h5>${board.description}<h5><hr><div>${content.body}</div>`,
          form: '',
          signup: buttons.signupOrUsername,
          login: buttons.loginOrLogout
        },
        partials: {
          head: '../partials/head'
        }
      })
    })
    .catch(error => res.send(error))
  } catch (e) {
    res.status(404);
      res.render('main', {
        locals: {
          title: config.domainName,
          body: `<h1>404 Nothing Here</h1>`,
          form: '',
          signup: '',
          login: '' 
        },
        partials: {
          head: '../partials/head'
        }
      })
  }
  };

  exports.getHome =  async (req, res) => {
  let buttons = {
    signupOrUsername: config.signupOrUsername,
    loginOrLogout: config.loginOrLogout
  };
  if (req.cookies['jwt'] && req.cookies['jwt'].username) {
    buttons.signupOrUsername = `<a class="nav-link" href="#">${req.cookies['jwt'].username}</a>`,
    buttons.loginOrLogout = `<a class="nav-link" href="/logout">Logout</a>`
  }
  let contentParagraph = `
  <div><p>  Hello and welcome to our backend project. I will allow the team to introduce
  themselves by making posts on the <a href="${config.domainName}/boards/welcome">Welcome</a> board.</p> 
  <p>This is a simple site with topic boards where users can create posts. Users can also 
  leave comments on posts.</p></div>
  `;
  let boardList = '';
  const boards = await Board.findAll().catch(err => console.log(err));
  Array.from(boards).forEach(board => {
    boardList+=`
    <div><h3><a href="${config.domainName}/boards/${board.name}">${board.name}</a></h3></div>
    <div><h4>${board.description}<h4></div>
    <br>
    `
  })
  const bodyStr = `
  <hr>
  ${contentParagraph}
  <hr>
  ${boardList} 
  `
  res.render('main', {
    locals: {
      title: config.domainName,
      body: bodyStr,
      form: '',
      signup: buttons.signupOrUsername,
      login: buttons.loginOrLogout
    },
    partials: {
          head: '../partials/head'
    }
  });
}

exports.errSignin =  (req, res) => {
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
    },
    partials: {
          head: '../partials/head'
    }
  });
}
  exports.deletePost = async (req, res) => {
      await Post.destroy({
        where: {
          [Op.and]: [
            {id: req.params.postId},
            {userId: req.userId}
          ]
        }
      })
      .catch(err => console.log(err));
      await res.redirect(`${config.domainName}/boards/${req.params.boardName}`);
};

  exports.editPost = async (req, res) => {
    await Post.update({
      title: req.body.title,
      content: req.body.content
    }, {
      where: {
        id: req.params.postId
      }
    })
    await res.redirect(`${config.domainName}/boards/${req.params.boardName}/${req.params.postId}`);
  };

  exports.editPostForm = async (req, res) => {
  Post.findOne({
    where: {
      id: req.params.postId
    }
  })
  .then(post => {
 res.render("makepost", {
    locals: {
      domain: config.domainName,
      boardName: req.params.boardName,
      titleValue: post.title,
      contentValue: post.content,
      action: `${config.domainName}/boards/${req.params.boardName}/${req.params.postId}/edit`,
      title: 'Edit Post' 
    },
    partials: {
        head: '../partials/head'
    }
  })
  })};

  exports.signin = (req, res) => {
   res.render("signin",{
     locals: {
       message:'', 
       domain:config.domainName,
       title: 'signin'
     },
     partials: {
       head: '../partials/head'
     }
    })
  }