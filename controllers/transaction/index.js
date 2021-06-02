const { v4 } = require('uuid');
const axios = require('axios');
const Webhook = require('coinbase-commerce-node').Webhook;
const webhookSecret = process.env.EXCHANGE_COIN_BASE_WEBHOOK;
const admin = process.env.EXCHANGE_TO_EMAIL;


const {
  getUserById,
} = require('../dao/db/user');

const {
  getUserWalletById,
  updateByWalletId
} = require('../dao/db/wallet');
const {
    getUserTransactionById, 
    updateTransaction,
    getAllTransactionsFromSingleUser,
    getDepositByCoinbaseCode,
    updateDepositStatus,
} = require('../dao/db/transaction');

const {
  getPagination,
  getPagingData,
} = require('../../utils/libs/pagination');

const { sendEmail } = require('../../utils/libs/send-email');


const { successResMsg, errorResMsg } = require('../../utils/libs/response');
const logger = require('../../logger').Logger;

/**
 * 
 * @param {*} req Codes for transaction
 * 
 * @param {*} res 
 */

 const successStatus = 'Confirmed';
 const pendingStatus = 'Pending';
 const failedStatus = 'Failed';
 const delayedStatus = 'Delayed';
 const resolvedStatus = 'Resolved & Successfull';
 const createdStatus = 'Created & Processing';

const sendAdminConfMail = async (admin, txnCode, amount, user) => {
    await sendEmail({
        email: admin, // TODO improve to send mail to to user also when transactions has been confirmed
        subject: 'Deposit Confirmed',
        message: `${user} with transaction Id ${txnCode} deposit of $${amount} has been confirmed, Do Pay the User ASAP`,
      })
}

const sendAdminFailMail = async (admin, txnCode, amount, user) => {
  await sendEmail({
      email: admin, 
      subject: 'Failed Deposit',
      message: `${user} with transaction Id ${txnCode} deposit of $${amount} has failed to pay up`,
    })
}

const approveDeposit = async (req, res) => {
    try {
        const { transactionId } = req.params

        // Get Transaction
        const transactionQuery = await getUserTransactionById(transactionId)
        const { walletId, amount, status } = transactionQuery.dataValues

        // Get Wallet Data
        const walletQuery = await getUserWalletById(walletId)
        const { balance } = walletQuery.dataValues

        if (status === 'Failed' || status ===  'Confirmed') {
            return successResMsg(res, 200, { message: 'This transaction have already been approved or rejected' })
        }

        // Update Status
        await updateTransaction(transactionId, { status: 'approved' })
        // Update Wallet with Amount
        await updateByWalletId(walletId, { balance: balance + amount })

        return successResMsg(res, 200, { message: `Transaction has been approved and wallet have been credited`})

    } catch (error) {
        logger.error(error);
        return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }
}

const depositListener = async (req, res) => {
    try {
  
      const {event} = req.body;
  
      const eventStringified = JSON.stringify(req.body);
  
    //   console.log('event received stringify', eventStringified);
  
  
      try {
        
        const verified = Webhook.verifyEventBody(
          eventStringified,
        req.headers['x-cc-webhook-signature'],
        webhookSecret
        );

        console.log('Incoming Event being sent is Successfully Verified');
  
        
  
        if (verified) {
              const CoinbaseDataObj= {
                type: event.type,
                code: event.data.code,
                timelineStatus: event.data.timeline,
                id: event.id,
                dateConfirmed: event.data.confirmed_at,
                amount: event.data.pricing.local.amount,
              };
          
              // console.log('passed Date', CoinbaseDataObj.dateConfirmed);
  
              const tranSanctionCode = CoinbaseDataObj.code;
  
              const checkTransactionExist = await getDepositByCoinbaseCode(tranSanctionCode);
  
              if (!checkTransactionExist) return errorResMsg(res, 403, 'Transaction does not exist in our records');

              const transaction = checkTransactionExist.dataValues;
              // const userId = transactions.userId;
              const user = await getUserById(transaction.userId)
              const userEmail = user.email;

          
              async function updateStatusFromCharge(CoinbaseDataObj) {
                
                const data = CoinbaseDataObj;
                             
                switch (data.type) {
                  case 'charge:confirmed':
                    console.log('confirmed', data.type); // TODO Remove all unnecessary console.log here
                    await updateDepositStatus(data.code, successStatus);
                    console.log('Status has been confirmed');

                    await Promise.all([
                      sendAdminConfMail(admin, transaction.txnCode, transaction.amount, userEmail),
                      sendEmail({
                        email: userEmail, 
                        subject: 'Deposit Confirmed',
                        message: `Dear ${userEmail}, you initiated a deposit with transaction id: ${data.code}, amount: $${transaction.amount},\n Your Deposit has confirmed and you'll receive payment anytime soon.`,
                      })
                    ])
                    break;
                  case 'charge:pending':
                    await updateDepositStatus(data.code, pendingStatus);
                    console.log('Status is pending');
                    break;
                  case 'charge:created':
                    await updateDepositStatus(data.code, createdStatus);
                    break;
                  case 'charge:failed':
                    await updateDepositStatus(data.code, failedStatus);
                    console.log('Status has failed');

                    await Promise.all([
                       sendAdminFailMail(
                         admin, 
                         transaction.txnCode, 
                         transaction.amount,
                         userEmail
                         ),
                       sendEmail({
                        email: userEmail, 
                        subject: 'Deposit Status Failed',
                        message: `Dear ${userEmail}, you initiated a deposit with transaction id: ${data.code}, amount: $${transaction.amount}, \n The transaction has failed due to you didnt pay within the given timeframe`,
                      })
                    ])
                    

                    
                    console.log('Status has failed paa');

                    // await sendAdminMail(admin, transaction.txnCode, transaction.amount);
                    break;
                  case 'charge:delayed':
                    await updateDepositStatus(data.code, delayedStatus);
                    console.log('Status is been delayed');
                    break;
                  case 'charge:resolved':
                    await updateDepositStatus(data.code, resolvedStatus);
                    console.log('Status has been resolved');
                    break;
                  default:
                    break;
                }
              };
          
              updateStatusFromCharge(CoinbaseDataObj);
              console.log('Passed WebHook Verification');
            return successResMsg(res, 200, 'Deposit Status Updated Successfully');
  
          } else {
             return errorResMsg(res, 404, 'Alaye hahaha you failed hacker!!, SUCK my dick');
            }
            
      } catch (error) {
        console.log('Webhook Error occurred', error.message);
      }
    
    } catch (error) {
      logger.error(error);
        return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }
  };

const rejectTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params

        // Update Status
        await updateTransaction(transactionId, { status: 'disapproved' })
        return successResMsg(res, 200, { message: `Transaction has been rejected, please contact an admin`})

    } catch (error) {
        logger.error(error);
        return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }
}


const approveWithdrawal = async (req, res) => {
    try {
        const { transactionId } = req.params

        // Get Transaction
        const transactionQuery = await getUserTransactionById(transactionId)
        const { amount, status, walletId } = transactionQuery.dataValues;

        // Get Wallet Data
        const walletQuery = await getUserWalletById(walletId)
        const { balance } = walletQuery.dataValues

        if (status === 'approved' || status ===  'disapproved') {
            return successResMsg(res, 200, { message: 'This transaction have already been approved or rejected' })
        }

        // Update Status
        await updateTransaction(transactionId, { status: 'approved' })
        // Update Wallet with Amount
        await updateByWalletId(walletId, { balance: balance - amount })

        return successResMsg(res, 200, { message: `Transaction has been approved.`})

    } catch (error) {
        logger.error(error);
        return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }
}

const getTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transactionQuery = await getUserTransactionById(transactionId)
    
    const transaction = await transactionQuery.dataValues;
    if (!transaction) {
      return errorResMsg(res, 400, 'transaction does not exist')
    }
  
    return successResMsg(res, 200, transaction);
    
  } catch (error) {
    logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const allTransactions = await getAllTransactionsFromSingleUser(userId, limit, offset);
    const data = getPagingData(allTransactions.count, page, limit);
     const dataInfo = {
      transactions: allTransactions,
      transaction: data,
      };

  return successResMsg(res, 200, dataInfo);
  } catch (error) {
    logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports = {
    approveDeposit,
    approveWithdrawal,
    rejectTransaction,
    getTransaction,
    getAllTransactions,
    depositListener
}