module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comment_tags', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      commentId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
<<<<<<< HEAD
<<<<<<< HEAD
        field: 'comment_id',
=======
        references: {
          model: 'comments',
          key: 'id',
          field: 'comment_id'
        },
>>>>>>> 1511fce (xong tag)
=======
        field: 'comment_id',
>>>>>>> 3aa86ca (like)
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
<<<<<<< HEAD
<<<<<<< HEAD
        field: 'user_id',
=======
        references: {
          model: 'users',
          key: 'id',
          field: 'user_id'
        },
>>>>>>> 1511fce (xong tag)
=======
        field: 'user_id',
>>>>>>> 3aa86ca (like)
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comment_tags');
  },
};
