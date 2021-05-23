const model = require('../../../models/index');

module.exports = {
  createRate: async (data) => {
    return model.MarketRate.create(data);
  },
  updateRate: async (clause, data) => {
    return model.MarketRate.update({...data }, { where: {...clause } });
  },
  getRates: async () => {
    return model.MarketRate.findAll();
  },
  getRate: async (rateId) => {
    return model.MarketRate.findOne({ where: { rateId } });
  },
}