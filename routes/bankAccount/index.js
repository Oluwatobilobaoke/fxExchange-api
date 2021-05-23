const express = require('express');
const {
    getBankAccountData,
    getBankAccounts,
    setDefaultAccount,
    createUserBankAccount,
    deleteBankAccount
} = require('../../controllers/bankAccount');

const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');
const { BankAccountValidation } = require('../../utils/validators/bankAccount/index');

const router = express.Router();

const getId = (req, res, next) => {
  const { userId } = req.user;
  req.params.userId = userId;
  next();
};

router.post(
  '/create',
  BankAccountValidation.validateBankAccountCreation,
  authorize(),
  createUserBankAccount,
);

router.get(
    '/data/:bankAccountId',
    authorize(),
    getBankAccountData,
);

router.get(
    '/',
    authorize(),
    getId,
    getBankAccounts,
);

router.patch(
    '/update/default/:bankAccountId',
    authorize(),
    setDefaultAccount,
);

router.delete(
  '/delete/:bankAccountId',
  authorize(),
  deleteBankAccount
);


module.exports = { bankRouter: router };
