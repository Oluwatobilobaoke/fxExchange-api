const express = require('express');

const {
  approveDeposit, approveWithdrawal, rejectTransaction,
  getTransaction,
} = require('../../controllers/transaction');

const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');

const router = express.Router();

router.get(
  '/:transactionId',
  authorize(),
  getTransaction
);

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