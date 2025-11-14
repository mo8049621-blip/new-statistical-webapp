module.exports = {
  apps: [{
    name: 'stats-frontend',
    script: 'node_modules/.bin/vite',
    cwd: __dirname,
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      PORT: 3000
    }
  }]
}