'use strict';
module.exports = (sequelize, DataTypes) => {
  const MarketRate = sequelize.define(
    'MarketRate',
    {
      id: {
        allowNull: false,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      perNairaRate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dollarsRate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nairaRate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coinRate: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '1',
      },
      rateId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
    },
  );
  MarketRate.associate = (model) => {

  };

  return MarketRate;
};
