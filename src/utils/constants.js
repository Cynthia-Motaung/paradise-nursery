// Application constants
export const APP_NAME = 'Paradise Nursery';
export const APP_DESCRIPTION = 'Your favorite houseplant shop';

// Product categories
export const CATEGORIES = [
  { id: 'all', name: 'All Plants' },
  { id: 'succulents', name: 'Succulents' },
  { id: 'tropical', name: 'Tropical' },
  { id: 'flowering', name: 'Flowering' },
  { id: 'low-light', name: 'Low Light' },
  { id: 'pet-friendly', name: 'Pet Friendly' }
];

// Local storage keys
export const STORAGE_KEYS = {
  CART: 'paradise_nursery_cart',
  THEME: 'paradise_nursery_theme',
  USER_PREFERENCES: 'paradise_nursery_user_prefs'
};

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  ORDERS: '/api/orders'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  PRODUCT_LOAD_ERROR: 'Failed to load products. Please try again.',
  CART_UPDATE_ERROR: 'Failed to update cart. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: 'Added to cart successfully!',
  ORDER_PLACED: 'Order placed successfully! Thank you for your purchase.',
  CART_UPDATED: 'Cart updated successfully!'
};

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]{10,}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_WISHLIST: process.env.REACT_APP_ENABLE_WISHLIST === 'true',
  ENABLE_REVIEWS: process.env.REACT_APP_ENABLE_REVIEWS === 'true',
  ENABLE_COMPARISON: process.env.REACT_APP_ENABLE_COMPARISON === 'true'
};