import { STORAGE_KEYS, ERROR_MESSAGES } from './constants';

/**
 * Format price with currency symbol
 */
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(price);
};

/**
 * Calculate total price for cart items
 */
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

/**
 * Calculate total number of items in cart
 */
export const calculateCartItemsCount = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Safe JSON parse with error handling
 */
export const safeJSONParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('JSON parse error:', error);
    return defaultValue;
  }
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 1) + '…';
};

/**
 * Get cart from localStorage with error handling
 */
export const getStoredCart = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    return safeJSONParse(stored, []);
  } catch (error) {
    console.error('Error reading cart from storage:', error);
    return [];
  }
};

/**
 * Save cart to localStorage with error handling
 */
export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('Error saving cart to storage:', error);
    return false;
  }
};

/**
 * Check if product is in stock (for future inventory management)
 */
export const isInStock = (product, quantity = 1) => {
  // For now, assume all products are in stock
  // This can be enhanced with actual inventory data
  return true;
};

/**
 * Calculate shipping cost (placeholder for future implementation)
 */
export const calculateShipping = (cartTotal, itemsCount) => {
  if (cartTotal >= 50) return 0; // Free shipping over $50
  if (itemsCount === 0) return 0;
  return 5.99; // Flat rate shipping
};