const model = require('../../../models/index');

module.exports = {
    createTransaction: async (data) => {
      return model.Transaction.create(data);
    },
    updateTransaction: async (transactionId, data) => {
      return model.Transaction.update(data, { where: { transactionId } });
    },
    getUserTransactionById: async (transactionId) => {
      return model.Transaction.findOne({ where: { transactionId } });
    },
    deleteTransactionById: async (userId) => {
      return model.Transaction.destroy({ where: { userId } });
    },
    getDepositByCoinbaseCode: async (txnCode) => {
      return model.Deposit.findOne({ where: { txnCode } });
    },
    updateDepositStatus: async (txnCode, status) => {
      return model.Transaction.update({ status: status }, { where: { txnCode } });
    },
    getAllTransactionsFromSingleUser: async (userId, limit, offset) => {
      return model.Transaction.findAndCountAll({
        where: {
           userId 
          },
          order: [
            ['updatedAt', 'DESC'],
        ],
          limit,
          offset,
        });
    },
    
}