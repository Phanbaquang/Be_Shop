module.exports = {
  apps: [
    {
      name: 'Phamacy-api',
      script: './src/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      }
    }
  ]
}
