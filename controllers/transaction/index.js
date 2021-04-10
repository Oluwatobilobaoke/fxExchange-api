const { v4 } = require('uuid');
const axios = require('axios')

const {
  getUserById,
} = require('../dao/db/user');

const {
  getUserWalletById,
  updateByWalletId
} = require('../dao/db/wallet');
const {
    getUserTransactionById, updateTransaction,
} = require('../dao/db/transaction');

const { successResMsg, errorResMsg } = require('../../utils/libs/response');
const logger = require('../../logger').Logger;

const approveDeposit = async (req, res) => {
    try {
        const { transactionId } = req.params

        // Get Transaction
        const transactionQuery = await getUserTransactionById(transactionId)
        const { walletId, amount, status } = transactionQuery.dataValues

        // Get Wallet Data
        const walletQuery = await getUserWalletById(walletId)
        const { balance } = walletQuery.dataValues

        if (status === 'approved' || status ===  'disapproved') {
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

module.exports = {
    approveDeposit,
    approveWithdrawal,
    rejectTransaction,
}