'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      name: 'abc def',
      email: 'abcde@example.com',
      password: 'hashed_password',
      bio: 'abcdef',
      phone_number: '123456789',
      avatar_url: 'http://example.com/avatar.jpg',
      is_private: false,
      is_active: false,
      first_login_date: new Date(),
      verificationCode: '123abc',
      verification_code_expiry: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
