// Request DTOs
const CreateOrderRequestDto = require('./request/create-order-request.dto');
const UpdateOrderStatusRequestDto = require('./request/update-order-status-request.dto');

// Response DTOs
const OrderResponseDto = require('./response/order-response.dto');
const OrderHistoryDto = require('./response/order-history.dto');
const RecentOrdersResponseDto = require('./recent-orders-response.dto');

module.exports = {
  // Request DTOs
  CreateOrderRequestDto,
  UpdateOrderStatusRequestDto,
  
  // Response DTOs
  OrderResponseDto,
  OrderHistoryDto,
  RecentOrdersResponseDto
};
