'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
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
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      walletId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM,
        values: ['deposit', 'withdrawal'],
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['approved', 'processing', 'disapproved'],
        allowNull: false,
        defaultValue: 'processing',
      },
    }
  )
  Transaction.associate = (model) => {
    Transaction.belongsTo(model.User, { foreignKey: 'userId' })
  };

  return Transaction;
};
