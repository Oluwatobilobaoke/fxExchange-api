const express = require('express');


const { home } = require('../controllers/home')

const index = express.Router();

index.get('', home);

module.exports.index = index;
