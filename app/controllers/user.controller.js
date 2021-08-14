const db = require("../models");
const {post: Post, comment: Comment, board: Board} = db;
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
  res.redirect('./');
}

exports.makeComment = (req, res) => {
  Comment.create({
    content: req.body.content,
    userId: req.userId,
    postId: postId
  });
};

exports.getPost = async (req, res) => {
  const post = await Post.findOne({
     where: {
       title: req.params.postTitle
     }
   });
   const comments = await Comment.findAll({
     where:{
       postId: post.id
     },
     include: User
   });
   let commentStr = "";
   Array.from(comments).forEach(comment => {
   commentStr+=` 
      <div><p> ${comment.content} | ${comment.user.username}</p></div>
      `
   });
   let postStr = `
      <div><p> ${post.content} </p></div>
   `;
   const content = {
     title: post.title,
     content: `
      ${postStr} 
      <br>
      <hr>
      ${commentStr}
      <hr>
     `
   }
   res.render('main', {
    locals: {
      title: content.title,
      body: content.body
    },
    partials: {
      form: '/partials/makecomment'
    }
  })
  }