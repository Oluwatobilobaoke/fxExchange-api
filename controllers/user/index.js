const {
    getUserById,
    updateUserRoleToElite,
    updateUserRoleToNoob,
    updateUserData
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


  const getProfile = async (req, res) => {
    const {userId} = req.params;
  
    try {
      const profileQuery = await getUserById(userId);
      const profile = await profileQuery.dataValues;
  
      if (!profile) {
        return errorResMsg(res, 400, 'User does not exist')
      }
  
      return successResMsg(res, 200, profile);
    } catch (error) {
      logger.error(error);
      return errorResMsg(res, 500, 'it is us, not you. Please try again');  
    }
  }

  const updateProfile = async (req, res) => {
    const {userId} = req.params;
  
    try {
    let userExists = await getUserById(userId);
  
    if (!userExists) {
      return errorResMsg(res, 403, 'User does not exist');
    } 
  
    const {
      firstName,
      lastName,
      phoneNumber,
      } = req.body;
  
    
      
    const userUpdateInformation = {
      firstName,
      lastName,
      phoneNumber,
      userId,
    };
  
    await updateUserData(userUpdateInformation, userId)
  
    userExists = await getUserById(userId);
  
    const profile = userExists.dataValues;
    const dataInfo = { message: 'Profile Updated Successfully!', profile };
    successResMsg(res, 201, dataInfo);
  
    } catch (error) {
      logger.error(error);
      return errorResMsg(res, 500, 'it is us, not you. Please try again');  
    }
  };
module.exports = {
    promote: promoteUser,
    demote: demoteUser,
    getProfile,
    updateProfile
}