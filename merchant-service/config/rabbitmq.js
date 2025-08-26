// RabbitMQ config for Merchant Service

const amqp = require('amqplib');

const config = {
  url: process.env.RABBITMQ_URL ,
  exchange: 'merchant_events',
  exchangeType: 'topic',
  options: { durable: true }
};

async function publish(eventType, payload) {
  const connection = await amqp.connect(config.url);
  const channel = await connection.createChannel();
  await channel.assertExchange(config.exchange, config.exchangeType, config.options);
  channel.publish(config.exchange, eventType, Buffer.from(JSON.stringify(payload)));
  await channel.close();
  await connection.close();
}

async function listen(eventTypes, handler) {
  const connection = await amqp.connect(config.url);
  const channel = await connection.createChannel();
  await channel.assertExchange(config.exchange, config.exchangeType, config.options);
  const q = await channel.assertQueue('', { exclusive: true });
  eventTypes.forEach(eventType => {
    channel.bindQueue(q.queue, config.exchange, eventType);
  });
  channel.consume(q.queue, msg => {
    if (msg.content) {
      const payload = JSON.parse(msg.content.toString());
      handler(msg.fields.routingKey, payload);
    }
  }, { noAck: true });
}

module.exports = { ...config, publish, listen };
