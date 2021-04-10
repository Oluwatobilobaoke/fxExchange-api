/* eslint-disable consistent-return */
const { signJWT } = require('../../utils/libs/token');
const { comparePassword } = require('../../utils/libs/password');
const {
  getUserByEmail,
} = require('../dao/db/user');
const { successResMsg, errorResMsg } = require('../../utils/libs/response');
const Role = require('../../Middleware/role');
const logger = require('../../logger').Logger;

const returnUser = async (req, res, email, password, user) => {
  try {

    // Decrypting User Password
    const valid = comparePassword(password, user.password);
    
    // If password is correct
    if (valid) {
      let data = {
        userId: user.userId.toString(),
        email: user.email,
        roleId: user.roleId,
      };

      const token = signJWT(data);

      const dataInfo = { message: 'Login Successful!', token };
      return successResMsg(res, 200, dataInfo);
    }
    // In the event of a wrong password
    return errorResMsg(res, 400, 'Email or password incorrect!');
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'Something went wrong');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await getUserByEmail(email);
      if (userData) {
        const user = userData.dataValues;
        return returnUser(req, res, email, password, user);
      }
      return errorResMsg(res, 401, 'Email or password incorrect');
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

module.exports = {
  login,
};
