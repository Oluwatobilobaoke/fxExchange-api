require('dotenv').config();

module.exports = {
  development: {
    username: process.env.EXCHANGE_DB_USER,
    password: process.env.EXCHANGE_DB_PASSWORD,
    database: process.env.EXCHANGE_DB_NAME,
    host: process.env.EXCHANGE_DB_HOST,
    dialect: process.env.EXCHANGE_DB_DIALECT,
    logging: false,
  },
  test: {
    username: process.env.EXCHANGE_DB_USER,
    password: process.env.EXCHANGE_DB_PASSWORD,
    database: process.env.EXCHANGE_DB_NAME,
    host: process.env.EXCHANGE_DB_HOST,
    dialect: process.env.EXCHANGE_DB_DIALECT,
    logging: true,
  },
  production: {
    username: process.env.EXCHANGE_DB_USER,
    password: process.env.EXCHANGE_DB_PASSWORD,
    database: process.env.EXCHANGE_DB_NAME,
    host: process.env.EXCHANGE_DB_HOST,
    dialect: process.env.EXCHANGE_DB_DIALECT,
    logging: false,
  },
}