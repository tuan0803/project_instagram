module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('post_reactions', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      postId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'post_id',
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
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

  down: async (queryInterface) => {
    await queryInterface.dropTable('post_reactions');
  },
};
