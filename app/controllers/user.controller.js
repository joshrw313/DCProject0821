const db = require("../models");
const {post: Post, comment: Comment, board: Board, user: User} = db;
const config = require("../config/auth.config");
const { post } = require("../models");

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
  res.redirect(`${config.domainName}/boards/${req.params.boardName}/${post.id}`);
}

exports.makeComment = (req, res) => {
  Comment.create({
    content: req.body.content,
    userId: req.userId,
    postId: req.params.postId
  });
  res.redirect(`${config.domainName}/boards/${req.params.boardName}/${req.params.postId}`);
};

exports.getPost = async (req, res) => {
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
   let commentStr = '';
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
     body: `<hr><b><a href="${config.domainName}/boards/${req.params.boardName}">${req.params.boardName}</a></b><span> - ${board.description}</span>
     <hr><h3>${post.title}</h3><hr> ${postStr} <hr>${commentStr}<hr>`
   }
   res.render('main', {
    locals: {
      title: config.domainName,
      body: content.body,
      postid: post.id
    },
    partials: {
      form: '../partials/makecomment'
    }
  })
  };

  exports.getBoard = async (req,res) => {
  const {boardName} = req.params;
  let contentStr = '';
  const board = await Board.findOne({
    where: {
      name: boardName
    }
  })
  // What if there is no post on that board?
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
          form: ''
        }
      })
    })
    .catch(err => console.log(err))
  };

  exports.getHome =  async (req, res) => {
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
      form: ''
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
    }
  });

  exports.deletePost = async (req, res) => {
    let post = await Post.findOne({
      where: {
        id: req.params.postId
      }
    })
    if (req.userId == post.userId){
      post.destroy()
    // Post.destroy({
    //   where: {
    //     id: req.params.postId
    //   }
    // })
    // .catch(err => console.log(err))
  }
  };
}