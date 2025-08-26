const customerService = require('../services/customer-service');


class CustomerOrderController {
  
  async createOrder(req, res) {
    try {
      
      const newOrder = await customerService.createOrder(req.body);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: newOrder
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create order'
      });
    }
  }

  // Get customer's orders
  async getCustomerOrders(req, res) {
    try {
      const customerId = req.user.id;

      const orders = await customerService.getCustomerOrders(customerId);

      res.status(200).json({
        success: true,
        message: 'Customer orders retrieved successfully',
        data: orders
      });
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  }

  // Get order by ID (customer can only view their own orders)
  async getOrderById(req, res) {
    try {
      const { orderId } = req.params;
      const customerId = req.user.id;

      const order = await customerService.getOrderById(orderId, customerId);

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: order
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      if (error.message.includes('not found') || error.message.includes('not authorized')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order'
      });
    }
  }

  // Cancel order (customer can cancel their own orders)
  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const customerId = req.user.id;

      const cancelledOrder = await customerService.cancelOrder(orderId, customerId);

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: cancelledOrder
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      if (error.message.includes('not authorized') || error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes('cannot be cancelled')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to cancel order'
      });
    }
  }

  // Get order history (customer can view their own order history)
  async getOrderHistory(req, res) {
    try {
      const { orderId } = req.params;
      const customerId = req.user.id;

      const orderHistory = await customerService.getOrderHistory(orderId, customerId);

      res.status(200).json({
        success: true,
        message: 'Order history retrieved successfully',
        data: orderHistory
      });
    } catch (error) {
      console.error('Error fetching order history:', error);
      if (error.message.includes('not authorized') || error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order history'
      });
    }
  }
}

module.exports = new CustomerOrderController();
