class ApiErrorResponse {
  constructor(success, message, errors) {
    this.success = success;
    this.message = message;
    this.errors = errors;
  }
  
}

module.exports = ApiErrorResponse;