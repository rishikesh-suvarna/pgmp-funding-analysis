const winston = require('winston');

exports.logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      // new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/error/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined/combined.log' })
    ]
});