const express = require('express');

const {
  approveDeposit, approveWithdrawal, rejectTransaction,
  getTransaction,
  getAllTransactions,
  depositListener,
} = require('../../controllers/transaction');

const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');

const getId = (req, res, next) => {
  const { userId } = req.user;
  req.params.userId = userId;
  next();
};

const router = express.Router();

// Deposit WebHook from Coinbase
router.post('/sale-callback', depositListener);

router.get(
  '/:transactionId',
  authorize(),
  getTransaction
);

router.get(
  '/',
  authorize(),
  getId,
  getAllTransactions
)

router.patch(
    '/deposit/approve/:transactionId',
    authorize(Role.Admin),
    approveDeposit
);

router.patch(
    '/withdrawal/approve/:transactionId',
    authorize(Role.Admin),
    approveWithdrawal
);

router.patch(
    '/reject/:transactionId',
    authorize(Role.Admin),
    rejectTransaction
);

module.exports = { transactionRouter: router };