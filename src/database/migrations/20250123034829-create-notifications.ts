'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'user_id',
      },
      notifiableType: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'notifiable_type',
      },
      notifiableId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'notifiable_id',
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      shortContent: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'short_content',
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      readAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'read_at',
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'created_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'updated_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notifications');
  },
};
