const { v4 } = require('uuid');
const axios = require('axios')

const {
  getUserById,
} = require('../dao/db/user');
const {
  createUserWallet,
  getWallets,
  updateWallet,
  getUserWalletById,
  updateByWalletId
} = require('../dao/db/wallet');
const {
  createTransaction,
} = require('../dao/db/transaction');

const Role = require('../../Middleware/role');
const { successResMsg, errorResMsg } = require('../../utils/libs/response');
const logger = require('../../logger').Logger;

const baseURL = `${process.env.FIXER_CONVERT_URL}?access_key=${process.env.FIXER_API_KEY}`

// eslint-disable-next-line consistent-return
const getWalletData = async (req, res) => {
  try {
    const { walletId } = req.params
    const walletQuery = await getUserWalletById(walletId)

    const walletData = await walletQuery

    if (!walletData) {
      return errorResMsg(res, 404, { message: 'Wallet Information Not Found' })
    }

    const dataInfo = { message: 'Wallet Information Found', data: walletData }
    return successResMsg(res, 200, dataInfo)
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}
const getUserWallets = async (req, res) => {
  try {
    const { userId } = req.params
    const walletQuery = await getWallets(userId)
    const walletData = await walletQuery

    if (!walletData) {
      return errorResMsg(res, 404, { message: 'Wallet Information Not Found' })
    }

    const dataInfo = { message: 'Wallet Information Found', data: walletData }
    return successResMsg(res, 200, dataInfo)
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

const updateWalletCurrency = async (req, res) => {
  try {
    const { walletId, currency } = req.body

    // get wallet dataInfo
    const wallet = await getUserWalletById(walletId)

    await updateWallet({ walletId }, { currency });

    if (!wallet) {
      return errorResMsg(res, 404, { message: 'Wallet Information Not Found' })
    }

    const dataInfo = { message: 'Wallet Information Updated' }
    return successResMsg(res, 200, dataInfo)
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

const deposit = async (req, res) => {
  try {
    const { userId, walletId, balance, currency } = req.body
    // get user data
    const userQuery = await getUserById(userId)
    const user = userQuery.dataValues

    // wallet update info
    const walletInformation = {
      userId,
      walletId,
      currency
    }

    const transactionId = v4()

    // transaction info
    const transactionInformation = {
      userId,
      transactionId,
      walletId,
      currency,
      type: 'deposit',
      amount: balance
    }

    const dataInfo = { message: 'Wallet funding initiated, awaiting approval' }

    // If user role === Elite
    // create new wallet for user and make transaction 
    if (req.user.roleId === Role.Elite) {
      const transactionId = v4();

      const walletsQuery = await getWallets(userId)
      const wallets = walletsQuery.map(wallet => wallet.dataValues)

      const walletToWithdraw = wallets.filter(wallet => wallet.currency === currency)

      if (walletToWithdraw.length !== 0) {
        if (walletToWithdraw[0].currency === currency) {
          await createTransaction({...transactionInformation, transactionId, walletId, status: 'approved' })
          // Update Wallet with Amount
          await updateByWalletId(walletToWithdraw[0].walletId, { balance: balance + walletToWithdraw[0].balance })
    
          return successResMsg(res, 200, { message: `Transaction has been approved and wallet has been credited`})
        }
      }
      
      if (user.currency !== currency) {
        // Wallet Data   
        const walletId = v4();

        const newWalletInformation = {
            userId,
            walletId,
            currency,
            balance
        }

        await createUserWallet(newWalletInformation);
        await createTransaction({...transactionInformation, transactionId, walletId, status: 'approved' })
        
        return successResMsg(res, 200, { message: 'Transaction successful. Wallet has been credited'})
      }
    }

    // compare currency n update wallet balance, convert to main currency if different currency is supplied

    if (user.currency !== currency) {
      // Convert currency using Fixer API
      const { data } = await axios.get(`${baseURL}&from=${currency}&to=${user.currency}&amount=${balance}`)

      if(!data.result) {
        return errorResMsg(res, 400, { message: 'An error occured while converting currency'})
      }

      const transactionData = { ...transactionInformation, amount: data.result }

      //  create transaction data
      await createTransaction(transactionData)

      return successResMsg(res, 200, dataInfo)
    }

    // Create Transaction -- To be Approved 
    await createTransaction(transactionInformation)
    return successResMsg(res, 200, dataInfo)

  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

const withdrawal = async (req, res) => {
  try {
    const { userId, walletId, amount, currency } = req.body
    // get user data
    const user = await getUserById(userId)
    // get wallet dataInfo
    const wallet = await getUserWalletById(walletId)

    const transactionId = v4()

    // transaction info
    const transactionInformation = {
      userId,
      walletId,
      transactionId,
      currency,
      type: 'withdrawal',
      amount
    }

    const dataInfo = { message: 'Withdrawal initiated, awaiting approval' }

    // If user role === Elite
    // withdraw from appropriate wallet for user and make transaction 
    if (req.user.roleId === Role.Elite) {

      const walletsQuery = await getWallets(userId)
      const wallets = walletsQuery.map(wallet => wallet.dataValues)
      
      const walletToWithdraw = wallets.filter( wallet => wallet.currency === currency)
      const { walletId } = walletToWithdraw[0] 

      await createTransaction({...transactionInformation, walletId })
      return successResMsg(res, 200, dataInfo)
    }

    if (wallet.balance < amount) {
      return successResMsg(res, 200, { message: 'Insufficient balance in wallet. Please make a deposit to complete transaction.' })
    }

    if (wallet.currency !== currency) {
      // Convert currency using Fixer API
      const { data } = await axios.get(`${baseURL}&from=${user.currency}&to=${currency}&amount=${balance}`)

      if(!data.result) {
        return errorResMsg(res, 400, { message: 'An error occured while converting currency'})
      }

      const transactionData = { ...transactionInformation, amount: data.result }

      if (wallet.balance < amount) {
        return successResMsg(res, 200, { message: 'Insufficient balance in wallet. Please make a deposit to complete transaction.' })
      }

      // create transaction data
      await createTransaction(transactionData)
      return successResMsg(res, 200, dataInfo)
    }

    // create transaction data
    await createTransaction(transactionInformation)
    return successResMsg(res, 200, dataInfo)

  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports = {
  deposit,
  withdrawal,
  getWalletData,
  getUserWallets,
  updateWalletCurrency
}