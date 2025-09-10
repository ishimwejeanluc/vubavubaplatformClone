const BaseException = require('./base-exception');

class UserNotFoundException extends BaseException {
  constructor(message = 'User with this email not found') {
    super(message);
  }
}

module.exports = UserNotFoundException;
