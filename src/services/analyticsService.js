import { logger } from '../utils/logger';

class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.userId = null;
  }

  init() {
    if (this.initialized) return;

    // Initialize analytics services
    this.initializeGoogleAnalytics();
    this.initializeHotjar();
    
    this.initialized = true;
    logger.ui.info('Analytics services initialized');
  }

  initializeGoogleAnalytics() {
    if (!window.gtag || !process.env.REACT_APP_GA_ID) return;

    window.gtag('config', process.env.REACT_APP_GA_ID, {
      page_title: document.title,
      page_location: window.location.href
    });
  }

  initializeHotjar() {
    if (!window.hj || !process.env.REACT_APP_HOTJAR_ID) return;

    window.hj('identify', this.userId, {});
  }

  setUser(user) {
    this.userId = user?.id || user?.sub;
    
    // Set user in analytics services
    if (window.gtag && this.userId) {
      window.gtag('config', process.env.REACT_APP_GA_ID, {
        user_id: this.userId
      });
    }

    if (window.hj && this.userId) {
      window.hj('identify', this.userId, {
        email: user?.email,
        name: user?.name
      });
    }
  }

  trackPageView(page, title) {
    if (!this.initialized) this.init();

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: page,
        send_to: process.env.REACT_APP_GA_ID
      });
    }

    logger.ui.debug('Page view tracked', { page, title });
  }

  trackEvent(category, action, label, value = null) {
    if (!this.initialized) this.init();

    const eventData = {
      event_category: category,
      event_label: label
    };

    if (value !== null) {
      eventData.value = value;
    }

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', action, eventData);
    }

    logger.ui.debug('Event tracked', { category, action, label, value });
  }

  // E-commerce specific events
  trackProductView(product) {
    this.trackEvent('ecommerce', 'product_view', product.name, product.price);
    
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'USD',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          currency: 'USD'
        }]
      });
    }
  }

  trackAddToCart(product, quantity = 1) {
    this.trackEvent('ecommerce', 'add_to_cart', product.name, product.price * quantity);
    
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: product.price * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          quantity: quantity,
          currency: 'USD'
        }]
      });
    }
  }

  trackRemoveFromCart(product, quantity = 1) {
    this.trackEvent('ecommerce', 'remove_from_cart', product.name, product.price * quantity);
  }

  trackCheckout(cart, step = 1) {
    this.trackEvent('ecommerce', 'checkout', `step_${step}`, this.calculateCartTotal(cart));
    
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: this.calculateCartTotal(cart),
        items: cart.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          currency: 'USD'
        }))
      });
    }
  }

  trackPurchase(order) {
    this.trackEvent('ecommerce', 'purchase', order.id, order.total);
    
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: order.id,
        currency: 'USD',
        value: order.total,
        tax: order.tax,
        shipping: order.shipping,
        items: order.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          currency: 'USD'
        }))
      });
    }
  }

  trackSearch(query, resultsCount) {
    this.trackEvent('search', 'product_search', query, resultsCount);
  }

  trackError(error, context = {}) {
    this.trackEvent('error', 'application_error', error.message);
    
    logger.ui.error('Error tracked in analytics', error, context);
  }

  calculateCartTotal(cart) {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export const analyticsService = new AnalyticsService();
