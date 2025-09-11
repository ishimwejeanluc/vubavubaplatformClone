const BaseException = require('./base-exception');

class ResourceAlreadyExistsException extends BaseException {
  constructor(message) {
    super(message);
  }
}

module.exports = ResourceAlreadyExistsException;
