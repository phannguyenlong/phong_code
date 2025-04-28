// middleware/loggerMiddleware.js
import moment from 'moment';

// Custom request logging middleware
const requestLogger = (req, res, next) => {
  const requestTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const { method, originalUrl, ip } = req;

  // Log request data to the console (or a file/database for production)
  console.log(`[${requestTime}] ${method} ${originalUrl} - IP: ${ip}`);

  // Call the next middleware/handler in the chain
  next();
};

export default requestLogger;
