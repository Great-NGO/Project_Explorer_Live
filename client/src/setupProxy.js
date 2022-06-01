const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            // target: 'https://ngotechprojectexplorer.herokuapp.com',
            changeOrigin: true,
        })
    );
};