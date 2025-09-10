const BaseException = require('./base-exception');

class UserAlreadyExistsException extends BaseException {
  constructor(message = 'User already exists with this email') {
    super(message);
  }
}

module.exports = UserAlreadyExistsException;
