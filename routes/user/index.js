const express = require('express');

const {
  promote, demote, getProfile,updateProfile
} = require('../../controllers/user');

const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');

const router = express.Router();

const getId = (req, res, next) => {
  const { userId } = req.user;
  req.params.userId = userId;
  next();
};

router.get(
  '/',
  authorize(),
  getId,
  getProfile
);

router.patch(
  '/update',
  authorize(),
  getId,
  updateProfile
)

router.patch(
    '/promote/:userId',
    authorize(Role.Admin),
    promote
);

router.patch(
    '/demote/:userId',
    authorize(Role.Admin),
    demote
);

module.exports = { userRouter: router };