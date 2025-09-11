const BaseException = require('./base-exception');

class ResourceNotFoundException extends BaseException {
  constructor(message ) {
    super(message);
  }
}

module.exports = ResourceNotFoundException;
