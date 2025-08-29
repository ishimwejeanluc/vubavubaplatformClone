const merchantService = require('../services/merchant-service');
const { validationResult } = require('express-validator');

class MerchantOrderController {
  // Get merchant's orders
  
 // Get order by ID (merchant can only view their own orders)
  async getOrderById(req, res) {
    try {
      const order = await merchantService.getOrderById(req.params.orderId, req.user.id);

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

  // Update order status (merchant can update status of their orders)
  async updateOrderStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { orderId } = req.params;
      const { merchantId, status } = req.body;

      const updatedOrder = await merchantService.updateOrderStatus(orderId, status, merchantId);

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error.message.includes('not authorized') || error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes('Invalid status transition')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update order status'
      });
    }
  }

  // Cancel order (merchant can cancel orders assigned to them)
  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const merchantId = req.user.id;

      const cancelledOrder = await merchantService.cancelOrder(orderId, merchantId);

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

  // Get order history (merchant can view order history for their orders)
  async getOrderHistory(req, res) {
    try {
      const { orderId } = req.params;
      const merchantId = req.user.id;

      const orderHistory = await merchantService.getOrderHistory(orderId, merchantId);

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

  // Get order statistics (merchant dashboard)
  async getOrderStatistics(req, res) {
    try {
      const merchantId = req.user.id;
      const stats = await merchantService.getOrderStatistics(merchantId);

      res.status(200).json({
        success: true,
        message: 'Order statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order statistics'
      });
    }
  }
}

module.exports = new MerchantOrderController();
