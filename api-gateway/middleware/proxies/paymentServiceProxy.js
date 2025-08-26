const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const paymentServiceProxy = createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL,
  changeOrigin: true,
  timeout: 30000,

  onProxyReq: (proxyReq, req, res) => {
    console.log('\n===  PAYMENT PROXY REQUEST ===');
    console.log('Original URL:', req.originalUrl);
    console.log('Proxy URL:', req.url);
    console.log('Method:', req.method);
    console.log('Target:', process.env.PAYMENT_SERVICE_URL);
    console.log('Request Body:', req.body);

    // SET ALL HEADERS FIRST (before any body operations)
    if (req.user) {
      console.log('Setting user headers:', req.user);
      proxyReq.setHeader('X-User-Id', req.user.id);
      proxyReq.setHeader('X-User-Role', req.user.role);
      proxyReq.setHeader('X-User-Email', req.user.email);
    }

    if (req.body && Object.keys(req.body).length > 0) {
      proxyReq.setHeader('Content-Type', 'application/json');
    }

    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      console.log('Forwarding body data:', bodyData);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }

    console.log('Headers being sent:', JSON.stringify(proxyReq.getHeaders(), null, 2));
    console.log('=============================\n');
  },

  onProxyRes: (proxyRes, req, res) => {
    console.log('\n===  PAYMENT PROXY RESPONSE ===');
    console.log('Status Code:', proxyRes.statusCode);
    delete proxyRes.headers['x-powered-by'];
    console.log('=================================\n');
  }
});

module.exports = paymentServiceProxy;
