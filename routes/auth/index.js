const express = require('express');
const {
  register
} = require('../../controllers/auth/register');
const { login } = require('../../controllers/auth/login');
const { verifyEmail } = require('../../controllers/auth/verify-email');

const {
  resetPassword,
  forgotPassword,
  resendVerificationLink,
} = require('../../controllers/auth/reset-password');
const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');
const { UserValidation } = require('../../utils/validators/auth/index');

const router = express.Router();

router.post(
  '/signup',
  UserValidation.validateUser,
  register
);

router.post('/login', UserValidation.validateLogin, login);
router.get('/email/verify', verifyEmail);

router.put(
  '/email/verify/resend',
  UserValidation.resendVerificationLink,
  resendVerificationLink
);

router.post(
  '/password/reset',
  UserValidation.resendVerificationLink,
  forgotPassword
);

router.put(
  '/password/reset/:resettoken',
  UserValidation.resetPassword,
  resetPassword
);
// router.delete('/:userId', authorize(Role.Admin), deleteUser);
module.exports ={ authRouter: router };
