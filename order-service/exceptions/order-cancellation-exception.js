const BaseException = require('./base-exception');

class OrderCancellationException extends BaseException {
  constructor(message ) {
    super(message);
  }
}

module.exports = OrderCancellationException;
