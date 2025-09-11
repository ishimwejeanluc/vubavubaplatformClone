const ApiErrorResponse = require('../utils/error-response');
const {
  ResourceAlreadyExistsException,
  ResourceNotFoundException,
  OrderCancellationException,
  InvalidOrderDataException,
} = require('./index');

class GlobalExceptionHandler {
  
  // Handle resource not found
  static handleResourceNotFound(err, req, res, next) {
    if (err instanceof ResourceNotFoundException) {
      return res.status(404).json(new ApiErrorResponse(
        false,
        "Not Found",
        err.message
      ));
    }
    next(err);
  }

  // Handle resource already exists
  static handleResourceAlreadyExists(err, req, res, next) {
    if (err instanceof ResourceAlreadyExistsException) {
      return res.status(409).json(new ApiErrorResponse(
        false,
        "Conflict" ,
        err.message
       ));
    }
    next(err);
  }

  // Handle order cancellation
  static handleOrderCancellation(err, req, res, next) {
    if (err instanceof OrderCancellationException) {
      return res.status(409).json(new ApiErrorResponse(
        false,
        err.message
      ));
    }
    next(err);
  }

  // Handle invalid order data
  static handleInvalidOrderData(err, req, res, next) {
    if (err instanceof InvalidOrderDataException) {
      return res.status(400).json(new ApiErrorResponse(
        false,
        "validation issue",
        err.message
        
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
      "Internal server error"
    ));
  }

  // Main exception handler
  static handle(err, req, res, next) {
    GlobalExceptionHandler.handleResourceNotFound(err, req, res, (err) => {
      if (err) {
        GlobalExceptionHandler.handleResourceAlreadyExists(err, req, res, (err) => {
          if (err) {
            GlobalExceptionHandler.handleOrderCancellation(err, req, res, (err) => {
              if (err) {
                GlobalExceptionHandler.handleInvalidOrderData(err, req, res, (err) => {
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
    });
  }
}

module.exports = GlobalExceptionHandler;
