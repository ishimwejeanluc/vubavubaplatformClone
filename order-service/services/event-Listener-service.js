const { Order, OrderItem, OrderHistory } = require('../models/association');
const { ORDER_STATUS } = require('../utils/Enums/order-status');
const { PAYMENT_STATUS } = require('../utils/Enums/payment-status');
const { sequelize } = require('../config/database');
const OrderService = require('./order-service');
const { OrderPlacedEventPublisher, OrderCanceledEventPublisher } = require('../events/publishedevent/index');
const { ResourceNotFoundException } = require('../exceptions');

const orderPlacedPublisher = new OrderPlacedEventPublisher();
const orderCanceledPublisher = new OrderCanceledEventPublisher();
const orderService = new OrderService();

class EventListenerService {
  async processOrderDelivered(orderId) {
    // Update order status to DELIVERED and add history
    const transaction = await sequelize.transaction();
    try {
      const order = await Order.findByPk(orderId);
      if (!order) throw new ResourceNotFoundException('Order not found');
      await order.update({ status: ORDER_STATUS.DELIVERED }, { transaction });
      await OrderHistory.create({
        order_id: orderId,
        status: ORDER_STATUS.DELIVERED
      }, { transaction });
      await transaction.commit();
      return await orderService.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async processOrderAssigned(orderId) {
    // Update order status to ASSIGNED and add history
    const transaction = await sequelize.transaction();
    try {
      const order = await Order.findByPk(orderId);
      if (!order) throw new ResourceNotFoundException('Order not found');
      await order.update({ status: ORDER_STATUS.ASSIGNED }, { transaction });
      await OrderHistory.create({
        order_id: orderId,
        status: ORDER_STATUS.ASSIGNED
      }, { transaction });
      await transaction.commit();
      return await orderService.getOrderById(orderId);
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      throw error;
    }
  }

  // Process payment success: update order status to PENDING and publish order.placed event
  async processPaymentSuccess(orderId) {
    console.log('[EventListenerService] processPaymentSuccess called for orderId:', orderId);
    const transaction = await sequelize.transaction();
    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, as: 'orderItems' }]
      });
      console.log('[EventListenerService] Order found:', !!order);
      if (!order) throw new Error('Order not found');

      // Update order status to PENDING and payment_status to PAID
      await order.update({ status: ORDER_STATUS.PENDING, payment_status: PAYMENT_STATUS.PAID }, { transaction });
      console.log('[EventListenerService] Order updated to PENDING/PAID');

      // Add order history
      await OrderHistory.create({
        order_id: orderId,
        status: ORDER_STATUS.PENDING
      }, { transaction });
      console.log('[EventListenerService] Order history created');

      // Publish order.placed event before committing
      const orderMenu = order.orderItems.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));
      await orderPlacedPublisher.publish({ orderId, orderMenu, amount: order.total_price });
      console.log('[EventListenerService] order.placed event published');

      await transaction.commit();
      return await orderService.getOrderById(orderId);
    } catch (error) {
      console.error('[EventListenerService] Error in processPaymentSuccess:', error);
      if (transaction && !transaction.finished) {
        await transaction.rollback();
        console.log('[EventListenerService] Transaction rolled back');
      }
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

      // Publish order.cancelled event before committing
      await orderCanceledPublisher.publish({ orderId });

      await transaction.commit();
      return await orderService.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new EventListenerService();
