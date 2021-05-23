'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MarketMarketRate', {
      id: {
        allowNull: false,
        unique: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      perNairaMarketRate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dollarsMarketRate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nairaMarketRate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coinMarketRate: {
        type: Sequelize.STRING,
        allowNull: false,
        default: '1'
      },
      MarketRateId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MarketRate');
  }
};