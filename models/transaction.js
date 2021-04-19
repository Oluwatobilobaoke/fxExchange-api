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
        type: DataTypes.DECIMAL(23, 2),
        allowNull: false,
      },
      coinAmount: {
        type: DataTypes.DECIMAL(23, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'processing',
      },
      txnCode: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '0',
      },
      addressSentTo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }
  )
  Transaction.associate = (model) => {
    Transaction.belongsTo(model.User, { foreignKey: 'userId' })
  };

  return Transaction;
};
