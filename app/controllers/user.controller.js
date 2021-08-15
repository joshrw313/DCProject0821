const db = require("../models");
const {post: Post, comment: Comment, board: Board, user: User} = db;
const config = require("../config/auth.config");

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
 
  Post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.userId,
    boardId: board.id
  });
  res.redirect(`${config.domainName}/boards/${req.params.boardName}`);
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
   });
   const comments = await Comment.findAll({
     where:{
       postId: post.id
     },
     include: User
   });
   let commentStr = '';
   comments.forEach(comment => {
   commentStr+=` 
      <div><p> ${comment.content} | ${comment.user.username}</p></div>
      `
   });
  
   let postStr = `
      <div><p> ${post.content} </p></div>
   `;
   const content = {
     title: post.title,
     body: `${postStr} <hr>${commentStr}<hr>`
   }
   res.render('main', {
    locals: {
      title: content.title,
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
      <div><p><a href="${config.domainName}/boards/${req.params.boardName}/${post.id}">${post.title}</a> | by: ${post.user.username}</p></div>
      `
    });
    let content = {
      title: board.name,
      body: contentStr,
    }
    return content  
    })
    .then(content => {
      res.render('main', {
        locals: {
          title: content.title,
          body: content.body,
          form: ''
        }
      })
    })
  };