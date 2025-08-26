// Central export for all proxy middleware
const authServiceProxy = require('./authServiceProxy');
const merchantServiceProxy = require('./merchantServiceProxy');
const orderServiceProxy = require('./orderServiceProxy');
const riderServiceProxy = require('./riderServiceProxy');
const paymentServiceProxy = require('./paymentServiceProxy');

module.exports = {
  authServiceProxy,
  merchantServiceProxy,
  orderServiceProxy,
  riderServiceProxy,
  paymentServiceProxy
};
