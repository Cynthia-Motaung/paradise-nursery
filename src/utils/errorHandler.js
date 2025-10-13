
/**
 * Centralized error handling utilities
 */

class AppError extends Error {
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CART_ERROR: 'CART_ERROR',
  PRODUCT_ERROR: 'PRODUCT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const handleError = (error, context = {}) => {
  // Log error for monitoring
  console.error('Application Error:', {
    message: error.message,
    code: error.code,
    context,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with error tracking service
    // sentry.captureException(error, { extra: context });
  }

  return error;
};

export const createError = (message, code, context = {}) => {
  return new AppError(message, code, context);
};

export const withErrorHandling = (fn, errorContext = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleError(error, errorContext);
    }
  };
};

export const safeJSONParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('JSON parse error:', error);
    return defaultValue;
  }
};

export const safeLocalStorage = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? safeJSONParse(item, defaultValue) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage key "${key}":`, error);
      return false;
    }
  }
};
