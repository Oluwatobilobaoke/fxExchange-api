'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['0', '1'],
        allowNull: false,
        defaultValue: '0',
      },
      email: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.STRING,
      },
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpire: DataTypes.BIGINT,
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
    await queryInterface.dropTable('Users');
  }
};