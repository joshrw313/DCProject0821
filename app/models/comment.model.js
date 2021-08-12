module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    content: {
      type: Sequelize.STRING
    },
  });

  return Comment;
};