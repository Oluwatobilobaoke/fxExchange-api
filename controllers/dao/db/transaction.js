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
}