const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const dotenv = require('dotenv');
const sequelize = require('sequelize');
const path = require('path');


dotenv.config();



const db = require('./models');
const { index } = require('./routes/home');
const { authRouter } = require('./routes/auth/index');
const { userRouter } = require('./routes/user/index');
const { walletRouter } = require('./routes/wallet/index');
const { transactionRouter } = require('./routes/transaction/index');
const { bankRouter } = require('./routes/bankAccount/index')
const { rateRouter } = require('./routes/rate/index')
const { seedAdmin } = require('./utils/libs/seed');
const { errorHandler } = require('./Middleware/error-handler');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
db.sequelize.sync().then(async () => {
    await seedAdmin();
  });

// connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//     await seedAdmin();
//     console.log('Connection has been established successfully.2');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

//connectDB();

// ROUTES
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use('/v1', index)
app.use('/v1/auth', authRouter);
app.use('/v1/user', userRouter);
app.use('/v1/wallet', walletRouter);
app.use('/v1/transaction', transactionRouter);
app.use('/v1/bank', bankRouter);
app.use('/v1/rate', rateRouter);

// global error handler
app.use(errorHandler);

module.exports = app;