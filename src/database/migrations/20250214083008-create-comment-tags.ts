module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comment_tags', {
      id: {
        type: Sequelize.INTEGER,
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
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('comment_tags', ['commentId']);
    await queryInterface.addIndex('comment_tags', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comment_tags');
  },
};
