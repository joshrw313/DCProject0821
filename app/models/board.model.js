module.exports = (sequelize, Sequelize) => {
  const Boards = sequelize.define("boards", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
  });

  return Boards;
};