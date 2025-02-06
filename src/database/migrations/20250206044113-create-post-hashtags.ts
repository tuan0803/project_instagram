'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('post_hashtags', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'post_id',
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      hashtagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'hashtag_id',
        references: {
          model: 'hashtags', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('post_hashtags');
  },
};
