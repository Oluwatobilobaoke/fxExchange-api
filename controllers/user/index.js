const {
    getUserById,
    updateUserRoleToElite,
    updateUserRoleToNoob
  } = require('../dao/db/user');
  const Role = require('../../Middleware/Role')
  const { successResMsg, errorResMsg } = require('../../utils/libs/response');
  const logger = require('../../logger').Logger;
  
  
  const promoteUser = async (req, res) => {
      try {
          const { userId } = req.params
          const userQuery = await getUserById(userId)
          const user = userQuery.dataValues

          console.log(user)
  
          if (user.roleId === Role.Elite) {
              return errorResMsg(res, 200, { message: 'User is already an Elite' })
          }
  
          await updateUserRoleToElite(userId)
          return successResMsg(res, 200, { message: `User ${user.firstName} has been upgraded to Elite` })
      } catch (error) {
          logger.error(error);
          return errorResMsg(res, 500, 'it is us, not you. Please try again');   
      }
  }
  
  const demoteUser = async (req, res) => {
      try {
          const { userId } = req.params
          const userQuery = await getUserById(userId)
          const user = userQuery.dataValues
  
          if (user.roleId === Role.Noob) {
              return errorResMsg(res, 200, { message: 'User is already a Noob' })
          }
  
          await updateUserRoleToNoob(userId)
          return successResMsg(res, 200, { message: `User ${user.firstName} has been demoted to Noob` })
      } catch (error) {
          logger.error(error);
          return errorResMsg(res, 500, 'it is us, not you. Please try again');   
      }
  }
module.exports = {
    promote: promoteUser,
    demote: demoteUser
}