const Joi = require('joi');
const Format = require('../index');
const validator = require('../validator');

class WalletValidation {
    static validateWalletDeposit(req, res, next) {
      const format = Joi.object().keys(
        {
            userId: Format.text,
          walletId: Format.text,
          currency: Format.text,
          balance: Format.number,
        },
        {}
      );
      validator(format, req.body, res, next);
    }
    static validateWalletWithdrawl(req, res, next) {
      const format = Joi.object().keys(
        {
            userId: Format.text,
          walletId: Format.text,
          currency: Format.text,
          amount: Format.number,
        },
        {}
      );
      validator(format, req.body, res, next);
    }
}

module.exports.WalletValidation = WalletValidation;