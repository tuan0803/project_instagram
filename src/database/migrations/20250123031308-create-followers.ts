'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('followers', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      followerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'follower_id',
      },
      followeeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'followee_id', 
      },
      isApproved: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
        field: 'is_approved',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        field: 'updated_at',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('followers');
  },
};
