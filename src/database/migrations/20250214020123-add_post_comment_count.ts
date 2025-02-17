'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('post_comment_counts', {
      postId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: { model: 'posts', key: 'id' },
        onDelete: 'CASCADE',
      },
      commentCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'comment_count',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('post_comment_counts');
  },
};
