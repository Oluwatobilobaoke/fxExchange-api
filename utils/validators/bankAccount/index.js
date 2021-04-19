const Joi = require('joi');
const Format = require('../index');
const validator = require('../validator');

class BankAccountValidation {
    static validateBankAccountCreation(req, res, next) {
      const format = Joi.object().keys(
        {
          userId: Format.text,
          bankName: Format.text,
					accountName: Format.text,
          accountType: Format.text,
          accountNumber: Format.number,
        },
        {}
      );
      validator(format, req.body, res, next);
    }
}

module.exports.BankAccountValidation = BankAccountValidation;