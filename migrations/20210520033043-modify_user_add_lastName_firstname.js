'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'firstName', Sequelize.STRING),
      queryInterface.addColumn('users', 'lastName', Sequelize.STRING),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'firstName'),
      queryInterface.removeColumn('users', 'lastName'),
    ]);
  }
};
