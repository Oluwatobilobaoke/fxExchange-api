const model = require('../../../models/index');

module.exports = {
  createUserWallet: async (data) => {
    return model.Wallet.create(data);
  },
  updateWallet: async (userId, data) => {
    return model.Wallet.update(data, { where: { userId } });
  },
  updateByWalletId: async (walletId, data) => {
    return model.Wallet.update(data, { where: { walletId } });
  },
  getUserWalletById: async (walletId) => {
    return model.Wallet.findOne({ where: { walletId }, attributes: ['userId', 'walletId', 'balance', 'currency'] });
  },
  getWallets: async (userId) => {
    return model.Wallet.findAll({ where: { userId }, attributes: ['userId', 'walletId', 'balance', 'currency'] });
  },
  deleteUserWalletById: async (userId) => {
    return model.Wallet.destroy({ where: { userId } });
  },
}