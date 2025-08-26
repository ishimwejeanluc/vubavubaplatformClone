// EventListener.js for Rider Service
// Listens to:
// - assignment.created
// - order.ready
const amqp = require('amqplib');
const { listen } = require('../config/rabbitmq');

class EventListener {


  async onAssignmentCreated(handler) {
    await listen(['assignment.created'], handler);
  }

  async onOrderReady(handler) {
    await listen(['order.ready'], handler);
  }
}

module.exports = EventListener;
