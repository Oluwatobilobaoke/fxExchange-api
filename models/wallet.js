'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define(
    'Wallet',
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      walletId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  }
  )
  Wallet.associate = (model) => {
    Wallet.belongsTo(model.User, { foreignKey: 'userId' })
  };

  return Wallet;
};
