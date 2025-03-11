import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  let formattedMessage = message;
  if (typeof message === 'object') {
    formattedMessage = JSON.stringify(message, null, 2);
  }
  return `${timestamp} [${level.toUpperCase()}]: ${formattedMessage}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join('logs', 'server.log'),
      maxsize: 1024 * 1024 * 5, // 5MB
      maxFiles: 5
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
