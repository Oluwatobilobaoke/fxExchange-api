const express = require('express');
const {
  deposit, withdrawal, getWalletData, getUserWallets, updateWalletCurrency, createWallet,
} = require('../../controllers/wallet');

const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');
const { WalletValidation } = require('../../utils/validators/wallet/index');

const router = express.Router();

router.get(
    '/data/:walletId',
    getWalletData
);

router.get(
    '/:userId',
    getUserWallets
);

router.put(
    '/update/currency',
    authorize(Role.Admin),
    updateWalletCurrency
);

router.post(
    '/deposit',
    WalletValidation.validateWalletDeposit,
    authorize([Role.Elite, Role.Noob, Role.Admin]),
    deposit
);

router.post(
    '/withdrawal',
    WalletValidation.validateWalletWithdrawl,
    authorize([Role.Elite, Role.Noob]),
    withdrawal
);

router.post(
    '/create',
    authorize(Role.Elite),
    createWallet
)

module.exports = { walletRouter: router };