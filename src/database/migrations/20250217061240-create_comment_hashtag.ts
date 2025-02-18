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
        references: {
          model: 'comments',
          key: 'id',
          field: 'comment_id',
        },
        onDelete: 'CASCADE',
      },
      hashtagId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'hashtags',
          key: 'id',
          field: 'hashtag_id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        field: 'created_at'
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comment_hashtag');
  },
};
