const STORAGE_KEYS = {
  CART: 'paradise_nursery_cart',
  USER_PREFERENCES: 'paradise_nursery_user_prefs'
};

export const storageService = {
  // Cart storage
  getCart() {
    try {
      const cart = localStorage.getItem(STORAGE_KEYS.CART);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from storage:', error);
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Error saving cart to storage:', error);
      return false;
    }
  },

  clearCart() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CART);
      return true;
    } catch (error) {
      console.error('Error clearing cart from storage:', error);
      return false;
    }
  },

  // User preferences storage
  getUserPreferences() {
    try {
      const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
      console.error('Error reading user preferences from storage:', error);
      return {};
    }
  },

  saveUserPreferences(preferences) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving user preferences to storage:', error);
      return false;
    }
  }
};