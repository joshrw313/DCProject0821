const db = require("../models");
const {post: Post} = db;
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