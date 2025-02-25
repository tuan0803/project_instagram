'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('post_hashtags', [{
      post_id: 1,
      hashtag_id: 1,
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('post_hashtags', null, {});
  },
};
