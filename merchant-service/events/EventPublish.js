
const { publish } = require('../config/rabbitmq');

class EventPublisher {
  async menuUpdated({ merchantId, menuItems }) {
    await publish('menu.updated', { merchantId, menuItems });
  }

  async orderReady({ orderId, merchantId }) {
    await publish('order.ready', { orderId, merchantId });
  }
}

module.exports = EventPublisher;
