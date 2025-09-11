const customerService = require('../services/customer-service');
const {CreateOrderRequestDto} = require('../dtos');
const ApiResponse = require('../utils/api-response');    


class CustomerOrderController {
  
  async createOrder(req, res, next) {
    try {
      const createOrderDto = new CreateOrderRequestDto(req.body);
      const newOrder = await customerService.createOrder(createOrderDto);

      res.status(201).json(new ApiResponse(true, 'Order created successfully', newOrder));
    } catch (error) {
     next(error);
    }
  }

  // Get customer's orders
  async getCustomerOrders(req, res,next) {
    try {
      const customerId = req.user.id;

      const orders = await customerService.getCustomerOrders(customerId);

      res.status(200).json(new ApiResponse(true, 'Customer orders retrieved successfully', orders));
    } catch (error) {
      next(error);
    }
  }

  // Get order by ID (customer can only view their own orders)
  async getOrderById(req, res, next) {
    try {
      const { orderId } = req.params;
      const customerId = req.user.id;

      const order = await customerService.getOrderById(orderId, customerId);

      res.status(200).json(new ApiResponse(true, 'Order retrieved successfully', order));
    } catch (error) {
      next(error);
    }
  }

  // Cancel order (customer can cancel their own orders)
  async cancelOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const customerId = req.user.id;

      const cancelledOrder = await customerService.cancelOrder(orderId, customerId);

      res.status(200).json(new ApiResponse(true, 'Order cancelled successfully', cancelledOrder));
    } catch (error) {
      next(error);
    }
  }

  async getOrderHistory(req, res,next) {
    try {
      const customerId = req.params.customerId;

      const orderHistory = await customerService.getOrderHistory(customerId);

      res.status(200).json(new ApiResponse(true, 'Order history retrieved successfully', orderHistory));
    } catch (error) {
      next(error);
    }
  }

  // Get customer order statistics
  async getCustomerOrderStatistics(req, res, next) {
    try {
      const customerId = req.params.customerId;

      const stats = await customerService.getCustomerOrderStatistics(customerId);

      res.status(200).json(new ApiResponse(true, 'Customer order statistics retrieved successfully', stats));
    } catch (error) {
      next(error);
    }
  }

  // Get recent orders for customer dashboard
  async getRecentOrders(req, res, next) {
    try {
      const customerId = req.params.customerId;
      const limit = req.query.limit || 5;

      const recentOrders = await customerService.getRecentOrders(customerId, limit);

      res.status(200).json(new ApiResponse(true, 'Recent orders retrieved successfully', recentOrders));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerOrderController();
