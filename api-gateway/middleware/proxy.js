const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Create Auth Service Proxy
 */
const authServiceProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL ,
  changeOrigin: true,
  timeout: 30000,
  onError: (err, req, res) => {
    console.error('Auth service proxy error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: 'Auth service unavailable'
      });
    }
  },
  onProxyReq: (proxyReq, req) => {
    // Forward user info if available
    if (req.user) {
      proxyReq.setHeader('X-User-Id', req.user.id);
      proxyReq.setHeader('X-User-Role', req.user.role);
      proxyReq.setHeader('X-User-Email', req.user.email);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Proxying: ${req.method} ${req.originalUrl} -> ${process.env.AUTH_SERVICE_URL || 'http://localhost:4000'}`);
    }
  },
  onProxyRes: (proxyRes, req) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Response: ${proxyRes.statusCode} from auth service`);
    }
  }
});

module.exports = {
  authServiceProxy
};
