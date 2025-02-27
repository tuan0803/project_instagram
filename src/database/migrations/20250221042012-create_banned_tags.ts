module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("banned_words", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        words: {
          type: Sequelize.STRING,
          allowNull: false,
          field: 'words',
          unique: true,
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
      await queryInterface.dropTable("banned_words");
    },
  };