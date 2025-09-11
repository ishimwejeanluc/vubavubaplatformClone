const merchantService = require('../services/merchant-service');
const ApiResponse = require('../utils/api-response');

class MerchantOrderController {
  // Get merchant's orders
  
 // Get order by ID (merchant can only view their own orders)
  async getOrderById(req, res, next) {
    try {
      const order = await merchantService.getOrderById(req.params.orderId, req.user.id);

      res.status(200).json(new ApiResponse(true,"order retrieved succesfully", order));
    } catch (error) {
      next(error);
    }
  }

  // Update order status (merchant can update status of their orders)
  async updateOrderStatus(req, res, next) {
    try {
      
      const { orderId } = req.params;
      const { merchantId, status } = req.body;

      const updatedOrder = await merchantService.updateOrderStatus(orderId, status, merchantId);

      res.status(200).json(new ApiResponse(true, 'Order status updated successfully',updatedOrder));
    } catch (error) {
      next(error);
    }
  }

  // Cancel order (merchant can cancel orders assigned to them)
  async cancelOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const merchantId = req.user.id;

      const cancelledOrder = await merchantService.cancelOrder(orderId, merchantId);

      res.status(200).json(new ApiResponse( true, 'Order cancelled successfully', cancelledOrder));
    } catch (error) {
      next(error);
    }
  }

  // Get order history (merchant can view order history for their orders)
  async getOrderHistory(req, res,next) {
    try {
      const { orderId } = req.params;
      const merchantId = req.user.id;

      const orderHistory = await merchantService.getOrderHistory(orderId, merchantId);

      res.status(200).json(new ApiResponse(true, 'Order history retrieved successfully', orderHistory));
    } catch (error) {
      next(error);
    }
  }

  // Get order statistics (merchant dashboard)
  async getOrderStatistics(req, res,next) {
    try {
      const merchantId = req.user.id;
      const stats = await merchantService.getOrderStatistics(merchantId);

      res.status(200).json(new ApiResponse(true, 'Order statistics retrieved successfully', stats));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MerchantOrderController();
