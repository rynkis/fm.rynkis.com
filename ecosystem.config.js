
module.exports = {
  apps: [{
    name: 'fm.gitmv',
    script: './server.rb',
    min_uptime: '60s',
    max_restarts: 20,
    max_memory_restart: '500M',
    instances: 1,
    exec_mode: 'fork_mode',
    error_file: './log/err.log',
    out_file: './log/out.log',
    // pid_file: "./log/car.pid",
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    watch: false,
    exec_interpreter: 'ruby',
    env_production: { // pm2 start ecosystem.config.js --env production
      'PORT': '8084'
    },
    env_test: { // pm2 start ecosystem.config.js --env test
      'PORT': '8084'
    }
  }]
}
