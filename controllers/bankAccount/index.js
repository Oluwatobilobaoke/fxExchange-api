const { v4 } = require('uuid');

const { 
	getUserBankAccountById,
	getUserBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccountById,
} = require('../dao/db/bankAccount');


const { successResMsg, errorResMsg } = require('../../utils/libs/response');
const logger = require('../../logger').Logger;


// const bankAccountAttribute = ['userId', 'bankAccountId', 'bankName', 'accountNumber', 'accountName', 'status'];

const getBankAccountData = async (req, res) => {
  try {
		const { bankAccountId } = req.params
		const bankAccountQuery = await getUserBankAccountById(bankAccountId);

		const bankAccountData = await bankAccountQuery;

		if (!bankAccountData) {
			return errorResMsg(res, 404, {message: 'Bank Account Information Not Found!'})
		}
      
		const dataInfo = { message: 'Bank Account Information Found', data: bankAccountData }
		return successResMsg(res, 200, dataInfo)
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

const getBankAccounts = async (req, res) => {
	try {
		const { userId } = req.params;
		const bankAccountQuery = await getUserBankAccounts(userId);
		const bankAccountData = await bankAccountQuery;

		if (!bankAccountData) {
			return errorResMsg(res, 404, { message: 'You have not added any Bank Account ' });
		}

		const dataInfo = { message: 'Bank Account Information found', data: bankAccountData }
		return successResMsg(res, 200, dataInfo)
	} catch (error) {
		logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
	}
}

const setDefaultAccount = async (req, res) => {

	try {
		const { bankAccountId } = req.body;

		// get bank information
		const bankAccount = await getUserBankAccountById(bankAccountId);

		if (!bankAccount) {
      return errorResMsg(res, 404, { message: 'Bank Account Information Not Found' })
    }

		await updateBankAccount({ bankAccountId }, { status: true })

    const dataInfo = { message: 'Bank Account Information Updated' }
    return successResMsg(res, 200, dataInfo)

	} catch (error) {
		logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

const deleteBankAccount = async (req, res) => {
  try {
    const { bankAccountId } = req.params;

    const bankAccount = await getUserBankAccountById(bankAccountId);

    if (!bankAccount) {
      return errorResMsg(res, 400, 'Bank Account does not exist');
    }

    await deleteBankAccountById(bankAccountId);

    const dataInfo = { message: 'Bank Account Information Deleted Successfully' }
    return successResMsg(res, 200, dataInfo)

  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

const createUserBankAccount = async (req, res) => {

	try {
		const { bankName, accountNumber, accountName, accountType, userId } = req.body;

		// Create a record of Bank Account
		const bankAccountId = v4();

		const bankAccountInformation = {
			userId,
			bankName,
			accountNumber,
			accountName,
			accountType,
			bankAccountId
		};

		await createBankAccount(bankAccountInformation);

		const dataInfo = { message: 'Bank Account Added successfully! '};

		successResMsg(res, 201, dataInfo);
	} catch (error) {
		logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
	}
}

module.exports = {
	getBankAccountData,
	getBankAccounts,
	setDefaultAccount,
	createUserBankAccount,
  deleteBankAccount,
}