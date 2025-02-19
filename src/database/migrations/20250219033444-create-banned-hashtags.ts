module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("banned_hashtags", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      hashtag: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'hashtag',
        unique: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("banned_hashtags");
  },
};
