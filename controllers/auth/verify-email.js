/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const { verifyJWT } = require('../../utils/libs/token');
const { successResMsg, errorResMsg } = require('../../utils/libs/response');
const { getUserByEmail, updateUser } = require('../dao/db/user');
const logger = require('../../logger').Logger;

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
  const { verification_token } = req.query;
  if (!verification_token)
    return errorResMsg(res, 400, 'Verification code missing');

  const decoded = await verifyJWT(verification_token);
  if (
    decoded &&
    decoded.name !== 'JsonWebTokenError' &&
    decoded.name !== 'TokenExpiredError'
  ) {
    try {
      const user = await getUserByEmail(decoded.email);
      if (!user) return errorResMsg(res, 400, 'Email has not been registered');
      if (user.status === '1') {
        const dataInfo = { message: 'This email has already been verified' };
        return successResMsg(res, 200, dataInfo);
      }
      const status = '1';

      const dataToUpdate = { status };
      const updatedUser = await updateUser({ email: user.email }, dataToUpdate);

      if (updatedUser[0] === 1) {
        const dataInfo = { message: 'Email verification successful' };
        return successResMsg(res, 200, dataInfo);
      }
    } catch (error) {
      logger.error(JSON.stringify(error));
      return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }
  } else if (decoded.name === 'TokenExpiredError')
    return errorResMsg(res, 400, 'Verification email link has expired');
  else if (decoded.name === 'JsonWebTokenError')
    return errorResMsg(res, 400, decoded.message);
  else return errorResMsg(res, 500, 'Something went wrong!');
};

module.exports = {
  verifyEmail,
};
