const { Order, OrderItem, OrderHistory } = require('../models/association');
const { ORDER_STATUS } = require('../utils/Enums/order-status');
const { sequelize } = require('../config/database');
const { OrderReadyEventPublisher,OrderDeliveredEventPublisher} = require('../events/publishedevent/index');

const orderReadyPublisher = new OrderReadyEventPublisher();
class MerchantOrderService {
  // Get order by ID (merchant can only access their own orders)
  async getOrderById(orderId, merchantId) {
    const order = await Order.findOne({
      where: { 
        id: orderId,
        merchant_id: merchantId 
      },
      include: [
        {
          model: OrderItem,
          as: 'orderItems'
        },
        {
          model: OrderHistory,
          as: 'orderHistory',
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!order) {
      throw new Error('Order not found or you are not authorized to view this order');
    }

    return order;
  }

  // Get all orders for a merchant
  async getMerchantOrders(merchantId) {
    const orders = await Order.findAll({
      where: { merchant_id: merchantId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems'
        },
        {
          model: OrderHistory,
          as: 'orderHistory',
          limit: 1,
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return orders;
  }

  // Update order status (merchant workflow)
  // Update an order's status and publish the corresponding event
  async updateOrderStatus(orderId, newStatus, merchantId) {
    // Validate the new status against the enum
    if (!Object.values(ORDER_STATUS).includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const transaction = await sequelize.transaction();
    try {
      const order = await Order.findByPk(orderId);
      if (!order) throw new Error('Order not found');

      // Update order status
          await order.update({ status: newStatus }, { transaction });
      if (newStatus === ORDER_STATUS.READY) {
        
        await orderReadyPublisher.publish({ orderId, merchantId });
      } 
// Add order history record for the new status
 await OrderHistory.create({
        order_id: orderId,
        status: newStatus
      }, { transaction });
    
          
        

      await transaction.commit();
      return await this.getOrderById(orderId, merchantId);
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw error;
    }
  }

  // Cancel order (merchant can cancel orders assigned to them)
  async cancelOrder(orderId, merchantId) {
    const transaction = await sequelize.transaction();
    
    try {
      const order = await Order.findOne({
        where: { 
          id: orderId,
          merchant_id: merchantId 
        }
      });

      if (!order) {
        throw new Error('Order not found or you are not authorized to cancel this order');
      }

      // Check if order can be cancelled by merchant
      if (![ORDER_STATUS.PENDING, ORDER_STATUS.READY].includes(order.status)) {
        throw new Error('Order cannot be cancelled at this stage');
      }

      // Update order status to cancelled
      await order.update({ status: ORDER_STATUS.CANCELLED }, { transaction });

      // Create order history entry
      await OrderHistory.create({
        order_id: orderId,
        status: ORDER_STATUS.CANCELLED
      }, { transaction });

      await transaction.commit();

      return await this.getOrderById(orderId, merchantId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Get order history for a specific order (merchant can only view their own)
  async getOrderHistory(orderId, merchantId) {
    const order = await Order.findOne({
      where: { 
        id: orderId,
        merchant_id: merchantId 
      },
      include: [
        {
          model: OrderHistory,
          as: 'orderHistory',
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!order) {
      throw new Error('Order not found or you are not authorized to view this order');
    }

    return order.orderHistory;
  }

  // Get order statistics for merchant dashboard
  async getOrderStatistics(merchantId) {
    // Status breakdown
    const statusStats = await Order.findAll({
      where: { merchant_id: merchantId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'total_revenue']
      ],
      group: ['status']
    });

    // Total orders count
    const totalOrders = await Order.count({
      where: { merchant_id: merchantId }
    });

    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.count({
      where: {
        merchant_id: merchantId,
        createdAt: {
          [sequelize.Op.gte]: today,
          [sequelize.Op.lt]: tomorrow
        }
      }
    });

    // Pending orders count
    const pendingOrders = await Order.count({
      where: {
        merchant_id: merchantId,
        status: ORDER_STATUS.PENDING
      }
    });

    // Ready orders count
    const readyOrders = await Order.count({
      where: {
        merchant_id: merchantId,
        status: ORDER_STATUS.READY
      }
    });

    // Total revenue
    const totalRevenue = await Order.sum('total_price', {
      where: { merchant_id: merchantId }
    });

    return {
      statusBreakdown: statusStats,
      totalOrders,
      todayOrders,
      pendingOrders,
      readyOrders,
      totalRevenue: totalRevenue || 0
    };
  }

  // Get orders that need attention (pending or ready)
  async getOrdersNeedingAttention(merchantId) {
    const orders = await Order.findAll({
      where: {
        merchant_id: merchantId,
        status: [ORDER_STATUS.PENDING, ORDER_STATUS.READY]
      },
      include: [
        {
          model: OrderItem,
          as: 'orderItems'
        },
        {
          model: OrderHistory,
          as: 'orderHistory',
          limit: 1,
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'ASC']] // Oldest first for prioritization
    });

    return orders;
  }

  // Validate status transitions for merchant workflow
  isValidStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
      [ORDER_STATUS.WAITING]: [ORDER_STATUS.PENDING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.READY]: [ORDER_STATUS.ASSIGNED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.ASSIGNED]: [ORDER_STATUS.DELIVERED],
      [ORDER_STATUS.DELIVERED]: [], // Final status
      [ORDER_STATUS.CANCELLED]: [] // Final status
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  // Get recent orders for merchant dashboard
  async getRecentOrders(merchantId, limit = 10) {
    const orders = await Order.findAll({
      where: { merchant_id: merchantId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems'
        },
        {
          model: OrderHistory,
          as: 'orderHistory',
          limit: 1,
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });

    return orders;
  }
}

module.exports = new MerchantOrderService();
