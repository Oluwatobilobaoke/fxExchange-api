const express = require('express');

const {
  promote, demote
} = require('../../controllers/user');

const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');

const router = express.Router();

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