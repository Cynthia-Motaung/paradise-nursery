
const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = process.env.NODE_ENV === 'production' 
  ? LogLevel.WARN 
  : LogLevel.DEBUG;

class Logger {
  constructor(module) {
    this.module = module;
  }

  error(message, error = null, context = {}) {
    this.log(LogLevel.ERROR, message, error, context);
  }

  warn(message, context = {}) {
    this.log(LogLevel.WARN, message, null, context);
  }

  info(message, context = {}) {
    this.log(LogLevel.INFO, message, null, context);
  }

  debug(message, context = {}) {
    this.log(LogLevel.DEBUG, message, null, context);
  }

  log(level, message, error = null, context = {}) {
    if (level > currentLogLevel) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: this.getLevelName(level),
      module: this.module,
      message,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      };
    }

    // Console output
    this.consoleLog(level, logEntry);

    // TODO: In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(logEntry);
    }
  }

  consoleLog(level, entry) {
    const styles = {
      [LogLevel.ERROR]: 'color: red; font-weight: bold;',
      [LogLevel.WARN]: 'color: orange; font-weight: bold;',
      [LogLevel.INFO]: 'color: blue;',
      [LogLevel.DEBUG]: 'color: gray;'
    };

    console.groupCollapsed(`%c[${entry.level}] ${entry.module}: ${entry.message}`, styles[level]);
    console.log('Timestamp:', entry.timestamp);
    console.log('Context:', entry.context);
    if (entry.error) {
      console.log('Error:', entry.error);
    }
    console.groupEnd();
  }

  sendToLoggingService(entry) {
    // TODO: Integrate with logging service (e.g., LogRocket, Sentry)
    // For now, we'll just store in localStorage for debugging
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(entry);
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }

  getLevelName(level) {
    return Object.keys(LogLevel).find(key => LogLevel[key] === level) || 'UNKNOWN';
  }
}

// Create logger instance for different modules
export const createLogger = (module) => new Logger(module);

// Default loggers for common modules
export const logger = {
  auth: createLogger('Auth'),
  cart: createLogger('Cart'),
  products: createLogger('Products'),
  ui: createLogger('UI'),
  api: createLogger('API')
};

// Error boundary logger
export const errorBoundaryLogger = createLogger('ErrorBoundary');
