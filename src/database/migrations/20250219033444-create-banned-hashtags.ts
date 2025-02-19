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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'created_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("banned_hashtags");
  },
};
