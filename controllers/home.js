const { successResMsg, errorResMsg } = require('../utils/libs/response');
const logger = require('../logger').Logger;



const home = (req, res) => {
  res.status(200).json({ message: 'Welcome to Zeek Xchange API' });
};



module.exports = { home };
