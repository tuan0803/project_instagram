'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tokens', [{
      user_id: 1,
      access_token: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ./',
      refresh_token: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ./',
      expires_at: Math.floor(Date.now() / 1000) + 3600, 
      refresh_expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 3600), 
      created_at: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tokens', null, {});
  }
};
