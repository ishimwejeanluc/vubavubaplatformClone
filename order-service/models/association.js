const Order = require('./order');
const OrderItem = require('./order-item');
const OrderHistory = require('./order-history');

// Order has many OrderItems
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'orderItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// OrderItem belongs to Order
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// Order has many OrderHistory entries
Order.hasMany(OrderHistory, {
  foreignKey: 'order_id',
  as: 'orderHistory',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// OrderHistory belongs to Order
OrderHistory.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

module.exports = {
  Order,
  OrderItem,
  OrderHistory
};
