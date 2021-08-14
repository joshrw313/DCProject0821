const db = require("../models");
const {post: Post, comment: Comment} = db;
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

exports.makePost = (req, res) => {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.userId,
    boardId: boardId
  });
}

exports.makeComment = (req, res) => {
  Comment.create({
    content: req.body.content,
    userId: req.userId,
    postId: postId
  });
}