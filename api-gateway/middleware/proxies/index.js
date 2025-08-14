// Central export for all proxy middleware
const authServiceProxy = require('./authServiceProxy');
const merchantServiceProxy = require('./merchantServiceProxy');

module.exports = {
  authServiceProxy,
  merchantServiceProxy
};
