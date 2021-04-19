'use strict';
module.exports = (sequelize, DataTypes) => {
  const BankAccount = sequelize.define(
    'BankAccount',
    {
      id: {
        allowNull: false,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bankAccountId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
    },
  );
  BankAccount.associate = (model) => {
    BankAccount.belongsTo(model.User, { foreignKey: 'userId' })
  };

  return BankAccount;
};
