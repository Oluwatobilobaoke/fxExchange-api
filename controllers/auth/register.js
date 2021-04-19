const { v4 } = require('uuid');
const { sendEmail } = require('../../utils/libs/send-email');
const {
  getUserByEmail,
  createUser,
} = require('../dao/db/user');
const {
  createUserWallet,
} = require('../dao/db/wallet');

const { signJWT } = require('../../utils/libs/token');
const { hashPassword } = require('../../utils/libs/password');
const { successResMsg, errorResMsg } = require('../../utils/libs/response');
const {
  registerEmailContent,
} = require('../../utils/libs/email-templates/user-register-email-template');

const logger = require('../../logger').Logger;

const URL =
  process.env.NODE_ENV === 'development'
    ? process.env.EXCHANGE_DEV_URL
    : process.env.EXCHANGE_FRONT_END_URL;

const register = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;
  
    const userExists = await getUserByEmail(email);
    if (userExists && userExists.email === email)
      return errorResMsg(res, 403, 'Email is not available');
  
    const hashedPassword = hashPassword(password);
    const userId = v4();
  
    // Wallet Data   
    const walletId = v4();
  
    const walletInformation = {
        userId,
        walletId,
        currency: BTC,
    }
  
    const data = {
      email,
    };
    const token = signJWT(data);
  
    // User Data
    const userInformation = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId: 'ROL-ELITE',
      userId,
    };
  
    await createUser(userInformation);
    await createUserWallet(walletInformation);

    const verificationUrl = `${URL}/auth/email/verify/?verification_token=${token}`;

    await sendEmail({
      email,
      subject: 'Email Verification',
      message: await registerEmailContent(email, verificationUrl),
    });

    const dataInfo = { message: 'Registration successful. Verification email sent!' };
    successResMsg(res, 201, dataInfo);
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
  return false;
};

module.exports = {
  register,
};
