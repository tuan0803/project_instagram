'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('media', {
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
          model: 'posts', // Bảng 'posts'
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'url',
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'type',
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
    await queryInterface.dropTable('media');
  },
};
