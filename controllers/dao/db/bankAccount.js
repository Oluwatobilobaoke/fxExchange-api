const model = require('../../../models/index');

module.exports = {
    createBankAccount: async (data) => {
      return model.BankAccount.create(data);
    },
    updateBankAccount: async (bankAccountId, data) => {
      return model.BankAccount.update(data, { where: { bankAccountId } });
    },
    getUserBankAccountById: async (bankAccountId) => {
      return model.BankAccount.findOne({ where: { bankAccountId } });
    },
    deleteBankAccountById: async (userId) => {
      return model.BankAccount.destroy({ where: { userId } });
    },
    getUserBankAccounts: async (userId) => {
      return model.BankAccount.findAll({ where: { userId }, attributes: ['userId', 'bankAccountId', 'bankName', 'accountNumber', 'accountName', 'status'] });
    },
    getBankAccountByUserId: async (userId) => {
      return model.BankAccount.findOne({ where: { userId } });
    },
}