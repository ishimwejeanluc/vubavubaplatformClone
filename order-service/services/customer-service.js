const { Order, OrderItem, OrderHistory } = require('../models/association');
const { ORDER_STATUS } = require('../utils/Enums/order-status');
const { PAYMENT_STATUS } = require('../utils/Enums/payment-status');
const { sequelize } = require('../config/database');
const {OrderWaitingPaymentEventPublisher} = require('../events/publishedevent/EventPublish');
const orderWaitingPayment = new OrderWaitingPaymentEventPublisher();

class CustomerOrderService {
  // Create a new order with order items (after payment is completed)
    async createOrder(orderData) {
        const transaction = await sequelize.transaction();
        try {
          const { customer_id, merchant_id, delivery_address, orderItems, total_price } = orderData;
          // Create the order with status WAITING (waiting payment)
          const newOrder = await Order.create({
            customer_id,
            merchant_id,
            delivery_address,
            total_price,
            status: ORDER_STATUS.WAITING,
            payment_status: PAYMENT_STATUS.PENDING
          }, { transaction });

          // Create order items
          const orderItemsData = orderItems.map(item => ({
            order_id: newOrder.id,
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
          }));
          await OrderItem.bulkCreate(orderItemsData, { transaction });

          // Create initial order history entry
          await OrderHistory.create({
            order_id: newOrder.id,
            status: ORDER_STATUS.WAITING
          }, { transaction });

          await transaction.commit();

          // Publish order.waitingpayment event
          await orderWaitingPayment.publish({ orderId: newOrder.id, amount: newOrder.total_price });

          return await this.getOrderById(newOrder.id, customer_id);
        } catch (error) {
          if (!transaction.finished) {
            await transaction.rollback();
          }
          throw error;
        }
      }

  // Get order by ID (customer can only access their own orders)
  async getOrderById(orderId, customerId) {
    const order = await Order.findOne({
      where: { 
        id: orderId,
        customer_id: customerId 
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

  // Get all orders for a customer
  async getCustomerOrders(customerId) {
    const orders = await Order.findAll({
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
      order: [['createdAt', 'DESC']]
    });

    return orders;
  }

  // Cancel order (customer can only cancel their own orders)
  async cancelOrder(orderId, customerId) {
    const transaction = await sequelize.transaction();
    
    try {
      const order = await Order.findOne({
        where: { 
          id: orderId,
          customer_id: customerId 
        }
      });

      if (!order) {
        throw new Error('Order not found or you are not authorized to cancel this order');
      }

      // Check if order can be cancelled by customer
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

      return await this.getOrderById(orderId, customerId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Get order history for a specific order (customer can only view their own)
  async getOrderHistory(orderId, customerId) {
    const order = await Order.findOne({
      where: { 
        id: orderId,
        customer_id: customerId 
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

  // Get customer order statistics
  async getCustomerOrderStatistics(customerId) {
    const stats = await Order.findAll({
      where: { customer_id: customerId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'total_spent']
      ],
      group: ['status']
    });

    const totalOrders = await Order.count({
      where: { customer_id: customerId }
    });

    return {
      statusBreakdown: stats,
      totalOrders
    };
  }

  // Get recent orders for customer dashboard
  async getRecentOrders(customerId, limit = 5) {
    const orders = await Order.findAll({
      where: { customer_id: customerId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          limit: 3 // Show only first 3 items per order
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

module.exports = new CustomerOrderService();
