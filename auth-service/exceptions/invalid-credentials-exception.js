const BaseException = require('./base-exception');

class InvalidCredentialsException extends BaseException {
  constructor(message = 'Invalid email or password') {
    super(message);
  }
}

module.exports = InvalidCredentialsException;
