const express = require('express');
const {
    getBankAccountData,
    getBankAccounts,
    setDefaultAccount,
    createBankAccount,
} = require('../../routes/bankAccount');

const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');
const { BankAccountValidation } = require('../../utils/validators/bankAccount/index');

const router = express.Router();

router.get(
    '/data/:bankAccountId',
    getBankAccountData,
    authorize()
);

router.get(
    '/:userId',
    getBankAccounts,
    authorize()
);

router.put(
    '/update/default/:bankAccountId',
    setDefaultAccount,
    authorize()
);

router.post(
    '/create',
    createBankAccount,
    BankAccountValidation.validateBankAccountCreation,
    authorize(),
);
