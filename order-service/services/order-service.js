const { Order, OrderItem, OrderHistory } = require('../models/association');
const { ORDER_STATUS } = require('../utils/Enums/order-status');
const { PAYMENT_STATUS } = require('../utils/Enums/payment-status');
const { sequelize } = require('../config/database');




class OrderService {
  // Create a new order with order items (status: WAITING)
  

  // Process payment success: update order status to PENDING and publish order.placed event
  async processPaymentSuccess(orderId) {
    const transaction = await sequelize.transaction();
    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, as: 'orderItems' }]
      });
      if (!order) throw new Error('Order not found');

      // Update order status to PENDING and payment_status to PAID
      await order.update({ status: ORDER_STATUS.PENDING, payment_status: PAYMENT_STATUS.PAID }, { transaction });

      // Add order history
      await OrderHistory.create({
        order_id: orderId,
        status: ORDER_STATUS.PENDING
      }, { transaction });

      await transaction.commit();

      // Publish order.placed event with orderMenu (orderItems)
      const eventPublisher = new EventPublisher();
      const orderMenu = order.orderItems.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));
      await eventPublisher.orderPlaced({ orderId, orderMenu });
      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async processPaymentFailed(orderId) {
    const transaction = await sequelize.transaction();
    try {
      const order = await Order.findByPk(orderId);
      if (!order) throw new Error('Order not found');

      // Update order status to PENDING and payment_status to FAILED
      await order.update({ status: ORDER_STATUS.CANCELLED, payment_status: PAYMENT_STATUS.FAILED }, { transaction });

      // Add order history
      await OrderHistory.create({
        order_id: orderId,
        status: ORDER_STATUS.CANCELLED
      }, { transaction });

      await transaction.commit();
      
    // Publish order.cancelled event
      const eventPublisher = new EventPublisher();
      orderMenu = order.orderItems.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));
      await eventPublisher.orderCancelled({ orderId, orderMenu });
      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Get order by ID with items and history
  async getOrderById(orderId) {
    const order = await Order.findByPk(orderId, {
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
      throw new Error('Order not found');
    }

    return order;
  }

  // Get all orders for a customer
  async getCustomerOrders(customerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { rows: orders, count } = await Order.findAndCountAll({
      where: { customer_id: customerId },
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
      limit,
      offset
    });

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalOrders: count,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Get all orders for a merchant
  async getMerchantOrders(merchantId, status = null, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const whereClause = { merchant_id: merchantId };
    
    if (status) {
      whereClause.status = status;
    }
    
    const { rows: orders, count } = await Order.findAndCountAll({
      where: whereClause,
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
      limit,
      offset
    });

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalOrders: count,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Update order status (used by merchant)
  async updateOrderStatus(orderId, newStatus, merchantId) {
    const transaction = await sequelize.transaction();
    
    try {
      const order = await Order.findOne({
        where: { 
          id: orderId,
          merchant_id: merchantId 
        }
      });

      if (!order) {
        throw new Error('Order not found or you are not authorized to update this order');
      }

      // Check if status transition is valid
      if (!this.isValidStatusTransition(order.status, newStatus)) {
        throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
      }

      // Update order status
      await order.update({ status: newStatus }, { transaction });

      // Create order history entry
      await OrderHistory.create({
        order_id: orderId,
        status: newStatus
      }, { transaction });

      await transaction.commit();

      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Cancel order (can be done by customer or merchant)
  async cancelOrder(orderId, userId, userRole) {
    const transaction = await sequelize.transaction();
    
    try {
      let whereClause = { id: orderId };
      
      if (userRole === 'customer') {
        whereClause.customer_id = userId;
      } else if (userRole === 'merchant') {
        whereClause.merchant_id = userId;
      }

      const order = await Order.findOne({ where: whereClause });

      if (!order) {
        throw new Error('Order not found or you are not authorized to cancel this order');
      }

      // Check if order can be cancelled
      if (![ORDER_STATUS.WAITING, ORDER_STATUS.PENDING, ORDER_STATUS.READY].includes(order.status)) {
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

      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Get order history for a specific order
  async getOrderHistory(orderId, userId, userRole) {
    let whereClause = { id: orderId };
    
    if (userRole === 'customer') {
      whereClause.customer_id = userId;
    } else if (userRole === 'merchant') {
      whereClause.merchant_id = userId;
    }

    const order = await Order.findOne({
      where: whereClause,
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

  // Validate status transitions
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

  // Get order statistics for merchant dashboard
  async getOrderStatistics(merchantId) {
    const stats = await Order.findAll({
      where: { merchant_id: merchantId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'total_revenue']
      ],
      group: ['status']
    });

    return stats;
  }
}

module.exports = OrderService();
