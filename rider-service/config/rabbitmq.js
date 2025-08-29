// RabbitMQ config for Order Service

const amqp = require('amqplib');

const config = {
  url: process.env.RABBITMQ_URL ,
  exchange: 'order_events',
  exchangeType: 'topic',
  options: { durable: true }
};

async function publish(eventType, payload) {
  const connection = await amqp.connect(config.url);
  const channel = await connection.createChannel();
  await channel.assertExchange(config.exchange, config.exchangeType, config.options);
  channel.publish(config.exchange, eventType, Buffer.from(JSON.stringify(payload)));
  console.log(`[EVENT PUBLISH] ${eventType} sent with payload:`, payload);
  await channel.close();
  await connection.close();
}

async function listen(handlerMap) {
  const connection = await amqp.connect(config.url);
  const channel = await connection.createChannel();
  await channel.assertExchange(config.exchange, config.exchangeType, config.options);
  const queueName =  'rider_service_queue';
  const q = await channel.assertQueue(queueName, { durable: true });
  const eventTypes = Object.keys(handlerMap);
  eventTypes.forEach(eventType => {
    channel.bindQueue(q.queue, config.exchange, eventType);
  });
  console.log(`[EVENT LISTEN] Listening for events: ${eventTypes.join(', ')} on queue: ${queueName}`);
  channel.consume(q.queue, msg => {
    if (msg.content) {
      const payload = JSON.parse(msg.content.toString());
      const eventType = msg.fields.routingKey;
      const handler = handlerMap[eventType];
      if (handler) {
        handler(payload);
      } else {
        console.warn(`[EVENT WARNING] No handler for event type: ${eventType}`);
      }
    }
  }, { noAck: true });
}

module.exports = { ...config, publish, listen };
