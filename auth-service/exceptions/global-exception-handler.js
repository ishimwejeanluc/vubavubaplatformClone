const ApiErrorResponse = require('../utils/error-response');
const {
  UserAlreadyExistsException,
  UserNotFoundException,
  InvalidCredentialsException,
} = require('./index');

class GlobalExceptionHandler {
  
  

  // Handle user already exists
  static handleUserAlreadyExists(err, req, res, next) {
    if (err instanceof UserAlreadyExistsException) {
      return res.status(409).json(new ApiErrorResponse(
        false,
        "Conflict",
        err.message
      ));
    }
    next(err);
  }

  // Handle user not found
  static handleUserNotFound(err, req, res, next) {
    if (err instanceof UserNotFoundException) {
      return res.status(404).json(new ApiErrorResponse(
        false,
        "Not Found",
        err.message
      ));
    }
    next(err);
  }

  // Handle invalid credentials
  static handleInvalidCredentials(err, req, res, next) {
    if (err instanceof InvalidCredentialsException) {
      return res.status(401).json(new ApiErrorResponse(
        false,
        "Unauthorized",
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
        "Conflict",
        errorMessage
      ));
    }
    next(err);
  }

 
  static handleGenericException(err, req, res, next) {
    console.error('Unhandled error:', err);
    
    return res.status(500).json(new ApiErrorResponse(
      false,
      "Internal Server Error",
      "An unexpected error occurred"
    ));
  }

  // Main exception handler that combines all handlers
  static handle(err, req, res, next) {
    // Try each specific handler in sequence
    GlobalExceptionHandler.handleUserAlreadyExists(err, req, res, (err) => {
      if (err) {
        GlobalExceptionHandler.handleUserNotFound(err, req, res, (err) => {
          if (err) {
            GlobalExceptionHandler.handleInvalidCredentials(err, req, res, (err) => {
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
