const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const riderServiceProxy = createProxyMiddleware({
  target: process.env.RIDER_SERVICE_URL,
  changeOrigin: true,
  timeout: 30000,
  
  onProxyReq: (proxyReq, req, res) => {
    console.log('\n===  RIDER PROXY REQUEST ===');
    console.log('Original URL:', req.originalUrl);
    console.log('Proxy URL:', req.url);
    console.log('Method:', req.method);
    console.log('Target:', process.env.RIDER_SERVICE_URL);
    console.log('Request Body:', req.body);

  // SET ALL HEADERS FIRST (before any body operations)
    
    // 1. Set user headers first (if available)
    if (req.user) {
      console.log('Setting user headers:', req.user);
      proxyReq.setHeader('X-User-Id',  req.user.id);
      proxyReq.setHeader('X-User-Role', req.user.role);
      proxyReq.setHeader('X-User-Email', req.user.email);
    }

    // 2. Set content headers (if body exists)
    if (req.body && Object.keys(req.body).length > 0) {
      proxyReq.setHeader('Content-Type', 'application/json');
    }

    // 3. THEN handle body (this flushes headers)
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      console.log('Forwarding body data:', bodyData);
      
      // Set content length and write body
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
    
    console.log('Headers being sent:', JSON.stringify(proxyReq.getHeaders(), null, 2));
    console.log('=============================\n');
  },
  
  onProxyRes: (proxyRes, req, res) => {
    console.log('\n===  RIDER PROXY RESPONSE ===');
    console.log('Status Code:', proxyRes.statusCode);
    delete proxyRes.headers['x-powered-by'];
    console.log('=================================\n');
  },
  
  onError: (err, req, res) => {
    console.error('\n===  RIDER PROXY ERROR ===');
    console.error('Error:', err.message);
    console.error('Error Code:', err.code);
    console.error('Request URL:', req.originalUrl);
    console.error('Target:', process.env.RIDER_SERVICE_URL);
    console.error('====================\n');
    
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: 'Rider service unavailable',
        error: err.message,
        target: process.env.RIDER_SERVICE_URL,
      });
    }
  }
});

console.log('\n=== RIDER PROXY CONFIGURATION ===');
console.log('Rider Service Target:', process.env.RIDER_SERVICE_URL);
console.log('====================================\n');

module.exports = riderServiceProxy;
