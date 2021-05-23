const model = require('../../../models/index');
const Role = require('../../../Middleware/Role');
module.exports = {
    createUser: async (data) => {
      return model.User.create(data);
    },
    getUserByEmail: async (email) => {
        return model.User.findOne({ where: { email } });
    },
    updateUserStatus: async (email) => {
        return model.User.update({ status: '1' }, { where: { email } });
      },
    updateUser: async (clause, data) => {
      return model.User.update({ ...data }, { where: { ...clause } });
    },
    updateUserRoleToElite: async (userId) => {
      return model.User.update({ roleId: Role.Elite}, { where: { userId } });
    },
    updateUserRoleToNoob: async (userId) => {
      return model.User.update({ roleId: Role.Noob}, { where: { userId } });
    },
    getUserById: async (userId) => {
      return model.User.findOne({ where: { userId } });
    },
    updateUserData: async (data, userId) => {
      return model.User.update(data, { where: { userId } });
    },
    deleteUserById: async (userId) => {
      return model.User.destroy({ where: { userId } });
    },
    getUserByResetPasswordToken: async (resetPasswordToken) => {
      return model.User.findOne({
        where: {
          resetPasswordToken,
        },
      });
    },

}