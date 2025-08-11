const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Create Auth Service Proxy with proper body forwarding
 */
const authServiceProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL ,
  changeOrigin: true,
  timeout: 30000,
  
  // Fix: Ensure body is properly parsed and forwarded
  onProxyReq: (proxyReq, req, res) => {
    console.log('\n=== 🔄 PROXY REQUEST ===');
    console.log('Original URL:', req.originalUrl);
    console.log('Proxy URL:', req.url);
    console.log('Method:', req.method);
    console.log('Target:', process.env.AUTH_SERVICE_URL );
    console.log('Request Body:', req.body);

    // Forward the body data
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      console.log('Forwarding body data:', bodyData);
      
      // Set content length and type
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      
      // Write the body data
      proxyReq.write(bodyData);
    }
    
    // Forward user info if available
    if (req.user) {
      proxyReq.setHeader('X-User-Id', req.user.id);
      proxyReq.setHeader('X-User-Role', req.user.role);
      proxyReq.setHeader('X-User-Email', req.user.email);
    }
    
    console.log('Headers being sent:', JSON.stringify(proxyReq.getHeaders(), null, 2));
    console.log('========================\n');
  },
  
  onProxyRes: (proxyRes, req, res) => {
    console.log('\n=== 📤 PROXY RESPONSE ===');
    console.log('Status Code:', proxyRes.statusCode);
    console.log('Response Headers (before):', proxyRes.headers);
    delete proxyRes.headers['x-powered-by'];
  },
  
  onError: (err, req, res) => {
    console.error('\n=== 💥 PROXY ERROR ===');
    console.error('Error:', err.message);
    console.error('Error Code:', err.code);
    console.error('Request URL:', req.originalUrl);
    console.error('Target:', process.env.AUTH_SERVICE_URL );
    console.error('==================\n');
    
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: 'Auth service unavailable',
        error: err.message,
        target: process.env.AUTH_SERVICE_URL,
      });
    }
  }
});

console.log('\n===PROXY CONFIGURATION ===');
console.log('Auth Service Target:', process.env.AUTH_SERVICE_URL);
console.log('==============================\n');

module.exports = {
  authServiceProxy
};
