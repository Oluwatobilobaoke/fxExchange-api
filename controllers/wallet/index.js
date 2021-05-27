const { v4 } = require('uuid');
const axios = require('axios');
const Webhook = require('coinbase-commerce-node').Webhook;
const webhookSecret = process.env.EXCHANGE_COIN_BASE_WEBHOOK;
const adminMail = process.env.EXCHANGE_TO_EMAIL;

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
const { sendEmail } = require('../../utils/libs/send-email');

const {
  registerEmailContent,
} = require('../../utils/libs/emailTemplates/user-deposit-email-template');

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

    if (walletData.length == 0) {
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
    let amountInCoin;
    let addressSentTo;
    const { userId, walletId, balance, currency } = req.body
    // get user data
    const userQuery = await getUserById(userId);
    const user = userQuery.dataValues;
    const email = user.email;

    // wallet update info
    const walletInformation = {
      userId,
      walletId,
      currency
    }


    const ObjectToBeSent = {
      name: 'eel exchange',
      description: 'Demystifying the habit of automating sell',
      pricing_type: 'fixed_price',
      local_price: {
        amount: balance,
        "currency": "USD"
      },
      metadata: {
        customer_id: userId,
        customer_name: email,
      },
    };

    const apiCallLink = 'https://api.commerce.coinbase.com/charges';

    const options = {
      headers: {
      'Content-Type': 'application/json',
      'X-CC-Api-Key': 'f0f3b3e8-6f62-4c92-b76d-22754cb5b6c5',
      'X-CC-Version': '2018-03-22',
      }
    };
    
    const reqSent = await axios.post(apiCallLink, ObjectToBeSent , options);
   
    const resPonse = await reqSent;

    const { data } = resPonse;

    const dataInfo = {
      chargeResponse : data.data
    } 

    const depositCharge = dataInfo.chargeResponse;

    // console.log(JSON.stringify(depositCharge)); TODO remove console log here

    
    // const transactionId = v4()

    if (req.body.currency == 'BTC') {
      amountInCoin = depositCharge.pricing.bitcoin.amount;
      addressSentTo = depositCharge.addresses.bitcoin;
    } else if (req.body.currency == 'ETH') {
      amountInCoin = depositCharge.pricing.ethereum.amount;
      addressSentTo = depositCharge.addresses.ethereum;
    }

    // transaction info
    const transactionInformation = {
      userId,
      transactionId: depositCharge.id,
      walletId,
      currency,
      type: 'deposit',
      amount: balance,
      coinAmount: amountInCoin,
      addressSentTo,
      txnCode: depositCharge.code,
    }

    const transactionToBeSaved = await createTransaction(transactionInformation)

    const transaction = transactionToBeSaved.dataValues;
     console.log({transaction}); //TODO remove console log here

     console.log(email, adminMail);

    await Promise.all([
      sendEmail({
        email,
        subject: 'Deposit Notification',
       // message: await registerEmailContent(email, transaction.amount, transaction.coinAmount, transaction.addressSentTo, coinAmount, depositCharge.expires_at),
       message: await registerEmailContent(
         email, 
         transaction.amount, 
         transaction.coinAmount, 
         transaction.addressSentTo, 
         depositCharge.expires_at
         ),
        // message: ` Hello ${email}, You initiated a sale of $${transaction.amount}, you are to pay ${transaction.coinAmount} ${currency} into the given Address ${transaction.addressSentTo}, \n The Sale expires ${depositCharge.expires_at} `,
      }),
      sendEmail({
        email: adminMail,
        subject: ' Deposit Notification',
        message: `${email} just initiated a deposit of $${transaction.amount} worth of ${transaction.coinAmount} ${currency}`,
      }),
    ])

    

    const CoinbaseDataObj = {
      "message": "Deposit initiated successfully, awaiting confirmation/approval",
      transaction,
      expiresIn: depositCharge.expires_at,
    }

    return successResMsg(res, 200, CoinbaseDataObj)

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

const createWallet = async (req, res) => {
  try {

    const { userId, currency } = req.body;

    if (req.body.currency != "ETH") return errorResMsg(res, 500, 'incorrect currency');
    
    // Create a new wallet
    const walletId = v4();
  
    const walletInformation = {
      userId,
      walletId,
      currency
    }

    await createUserWallet(walletInformation);

    const dataInfo = { message: 'Wallet creation successful!.' };

    successResMsg(res, 201, dataInfo);
    
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
  updateWalletCurrency,
  createWallet,
}