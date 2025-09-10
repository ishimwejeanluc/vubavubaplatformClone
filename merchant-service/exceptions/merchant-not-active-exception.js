const BaseException = require('./base-exception');

class MerchantNotActiveException extends BaseException {
  constructor(message = 'Merchant account is not active') {
    super(message);
  }
}

module.exports = MerchantNotActiveException;
