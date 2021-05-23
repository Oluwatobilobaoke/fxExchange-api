const { v4 } = require('uuid');

const { 
	createRate,
  updateRate,
  getRates,
  getRate
} = require('../dao/db/rate');

const { successResMsg, errorResMsg } = require('../../utils/libs/response');
const logger = require('../../logger').Logger;

const getAllRates = async (req, res) => {
	try {

		const ratesQuery = await getRates();
		const ratesData = await ratesQuery;

		if (!ratesData) {
			return errorResMsg(res, 404, { message: 'You have not added any Any Rate' });
		}

		const dataInfo = { message: 'Current Rates', data: ratesData }
		return successResMsg(res, 200, dataInfo)
	} catch (error) {
    console.log(error);
		logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
	}
}

const getCoinRate = async (req, res) => {
  try {
    const { rateId } = req.params;
    const rateQuery = await getRate(rateId);
		const rateData = await rateQuery;

    if (!rateData) {
			return errorResMsg(res, 404, { message: 'Rate not found' });
		}

		const dataInfo = { message: 'Rate Info', data: rateData }
		return successResMsg(res, 200, dataInfo)

  } catch (error) {
    logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

const createARate = async (req, res) => {
  try {
    const { userId, perNairaRate, dollarsRate, nairaRate, coinRate } = req.body;

    const rateId = v4();

    const rateInformation = {
      userId,
      perNairaRate,
      dollarsRate,
      nairaRate,
      coinRate,
      rateId
    };

    await createRate(rateInformation);

    const dataInfo = { message: 'Rate created successfully!'}
		return successResMsg(res, 200, dataInfo)

  } catch (error) {
    logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

const updateMarketRate = async (req, res) => {
  try {
    
    const { rateId } = req.params;

    const { perNairaRate, dollarsRate, nairaRate, coinRate } = req.body;

    const dataToUpdate = {
      perNairaRate,
      dollarsRate,
      nairaRate,
      coinRate
    }

    const updatedRate = await updateRate({rateId: rateId}, dataToUpdate)

    if (updatedRate[0] === 1) {
      const dataInfo = { message: 'Rate Updated Successfully' }
      return successResMsg(res, 200, dataInfo);
    }

  } catch (error) {
    
    logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports = {
  getAllRates,
  getCoinRate,
  createARate,
  updateMarketRate
}