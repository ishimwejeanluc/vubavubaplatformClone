const ApiErrorResponse = require('../utils/error-response');
const {
  ResourceAlreadyExistsException,
  ResourceNotFoundException,
  MerchantNotActiveException,
} = require('./index');

class GlobalExceptionHandler {
  
  // Handle merchant already exists
  static handleMerchantAlreadyExists(err, req, res, next) {
    if (err instanceof ResourceAlreadyExistsException) {
      return res.status(409).json(new ApiErrorResponse(
        false,
        "conflict",
        err.message
      ));
    }
    next(err);
  }

  // Handle merchant not found
  static handleMerchantNotFound(err, req, res, next) {
    if (err instanceof ResourceNotFoundException) {
      return res.status(404).json(new ApiErrorResponse(
        false,
        err.message,
        null
      ));
    }
    next(err);
  }

  // Handle merchant not active
  static handleMerchantNotActive(err, req, res, next) {
    if (err instanceof MerchantNotActiveException) {
      return res.status(403).json(new ApiErrorResponse(
        false,
        err.message,
        null
      ));
    }
    next(err);
  }

  // Handle Sequelize validation errors
  static handleSequelizeValidation(err, req, res, next) {
    if (err.name === 'SequelizeValidationError') {
      const validationMessages = err.errors.map(error => error.message);
      return res.status(400).json(new ApiErrorResponse(
        false,
        "Validation Failed",
        validationMessages
      ));
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors[0]?.path || 'field';
      const errorMessage = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      return res.status(409).json(new ApiErrorResponse(
        false,
        errorMessage,
        null
      ));
    }
    next(err);
  }

  // Handle generic exceptions
  static handleGenericException(err, req, res, next) {
    console.error('Unhandled error:', err);
    
    return res.status(500).json(new ApiErrorResponse(
      false,
      "An unexpected error occurred",
      null
    ));
  }

  // Main exception handler
  static handle(err, req, res, next) {
    GlobalExceptionHandler.handleMerchantAlreadyExists(err, req, res, (err) => {
      if (err) {
        GlobalExceptionHandler.handleMerchantNotFound(err, req, res, (err) => {
          if (err) {
            GlobalExceptionHandler.handleMerchantNotActive(err, req, res, (err) => {
              if (err) {
                GlobalExceptionHandler.handleSequelizeValidation(err, req, res, (err) => {
                  if (err) {
                    GlobalExceptionHandler.handleGenericException(err, req, res, next);
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}

module.exports = GlobalExceptionHandler;
