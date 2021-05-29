const { successResMsg, errorResMsg } = require("../../utils/libs/response");
const { updateUser, getUserById } = require("../dao/db/user");

const { comparePassword, hashPassword } = require('../../utils/libs/password')

const updatePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const { userId } = req.params;

      const user = await getUserById(userId)
      
      if (!user)
      return successResMsg(res, 201, { message: 'user does not exist' });


      const isValid = await comparePassword(oldPassword, user.password);
      console.log(isValid);

      if (!isValid) {
        return errorResMsg(res, 401, 'Incorrect Password');
      }
      const hashedPassword = hashPassword(newPassword);
      await updateUser({ userId }, { password: hashedPassword})
      const data = { message: 'Password sucessfully updated' };
      return successResMsg(res, 200, data);
      
    } catch (err) {
      console.log(err);
      return errorResMsg(res, 500, 'Password could not be updated!');
    }
};

module.exports = {
  updatePassword,
}