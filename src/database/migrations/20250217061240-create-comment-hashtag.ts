module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comment_hashtags', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      commentId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'comment_id',
        onDelete: 'CASCADE',
      },
      hashtagId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'hashtag_id',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'created_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comment_hashtags');
  },
};
