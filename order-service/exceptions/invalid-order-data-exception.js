const BaseException = require('./base-exception');

class InvalidOrderDataException extends BaseException {
  constructor(message ) {
    super(message);
  }
}

module.exports = InvalidOrderDataException;
