'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    walletId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.STRING,
    },
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpire: DataTypes.BIGINT,
  });

  User.associate = (model) => {
    User.belongsTo(model.Role, {
      foreignKey: 'roleId',
    });
    User.hasMany(model.Transaction, {
      onDelete: 'cascade',
    });
    User.hasMany(model.Wallet, {
      onDelete: 'cascade',
    });
  };
  return User;
}