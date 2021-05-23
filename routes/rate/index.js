const express = require('express');

const {
  getAllRates,
  getCoinRate,
  createARate,
  updateMarketRate
} = require('../../controllers/rate');

const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');

const router = express.Router();

router.post(
  '/create',
  authorize(Role.Admin),
  createARate
);

router.patch(
  '/update/:rateId',
  authorize(Role.Admin),
  updateMarketRate,
)

router.get(
  '/',
  getAllRates,
)

router.get(
  '/:rateId',
  getCoinRate
)

module.exports = { rateRouter: router };