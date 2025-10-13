
import { orderAPI, cartAPI } from './apiServices';
import { logger } from '../utils/logger';
import { createError, ErrorCodes, withErrorHandling } from '../utils/errorHandler';
import { ValidationSchemas, withValidation } from '../utils/validators';

// Checkout validation schema
const checkoutSchema = {
  email: [ValidationSchemas.newsletter.email],
  shippingAddress: {
    firstName: [ValidationSchemas.profile.name],
    lastName: [ValidationSchemas.profile.name],
    address: [ValidationSchemas.profile.name],
    city: [ValidationSchemas.profile.name],
    state: [ValidationSchemas.profile.name],
    zipCode: [ValidationSchemas.profile.name],
    country: [ValidationSchemas.profile.name]
  },
  paymentMethod: {
    type: [value => ({ isValid: ['card', 'paypal'].includes(value), message: 'Invalid payment method' })],
    // Add more payment validation as needed
  }
};

class CheckoutService {
  async processCheckout(checkoutData) {
    return withErrorHandling(async () => {
      // Validate checkout data
      withValidation(checkoutSchema, checkoutData);

      const { cart, shippingAddress, paymentMethod, customerInfo } = checkoutData;

      // Validate cart
      if (!cart || !cart.items || cart.items.length === 0) {
        throw createError('Cart is empty', ErrorCodes.VALIDATION_ERROR);
      }

      // Calculate totals
      const subtotal = this.calculateSubtotal(cart.items);
      const shipping = this.calculateShipping(subtotal, shippingAddress);
      const tax = this.calculateTax(subtotal, shippingAddress);
      const total = subtotal + shipping + tax;

      // Create order payload
      const orderPayload = {
        items: cart.items,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress,
        paymentMethod,
        customerInfo,
        status: 'pending'
      };

      logger.cart.info('Processing checkout', {
        itemCount: cart.items.length,
        total,
        paymentMethod: paymentMethod.type
      });

      // Create order
      const order = await orderAPI.create(orderPayload);

      // Clear cart after successful order
      await cartAPI.clear();

      logger.cart.info('Checkout completed successfully', {
        orderId: order.id,
        total: order.total
      });

      return order;
    }, { operation: 'processCheckout' })();
  }

  calculateSubtotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  calculateShipping(subtotal, shippingAddress) {
    // Free shipping for orders over $50
    if (subtotal >= 50) {
      return 0;
    }

    // Flat rate shipping based on location
    const domesticStates = ['US', 'CA'];
    if (domesticStates.includes(shippingAddress.country)) {
      return 5.99;
    }

    // International shipping
    return 14.99;
  }

  calculateTax(subtotal, shippingAddress) {
    // Simple tax calculation - in real app, use tax API
    const taxRates = {
      'US': 0.08, // 8% average tax
      'CA': 0.13, // 13% HST
      'EU': 0.20  // 20% VAT
    };

    const rate = taxRates[shippingAddress.country] || 0;
    return subtotal * rate;
  }

  async validateShippingAddress(address) {
    return withErrorHandling(async () => {
      // In a real app, this would call a shipping validation API
      const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country'];
      
      for (const field of requiredFields) {
        if (!address[field]?.trim()) {
          throw createError(`Missing required field: ${field}`, ErrorCodes.VALIDATION_ERROR);
        }
      }

      // Validate zip code format for US
      if (address.country === 'US' && !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
        throw createError('Invalid ZIP code format', ErrorCodes.VALIDATION_ERROR);
      }

      return { valid: true, normalizedAddress: address };
    }, { operation: 'validateShippingAddress' })();
  }

  async getShippingOptions(address) {
    return withErrorHandling(async () => {
      // Mock shipping options - in real app, call shipping API
      const baseOptions = [
        {
          id: 'standard',
          name: 'Standard Shipping',
          price: 5.99,
          estimatedDays: '5-7 business days'
        },
        {
          id: 'express',
          name: 'Express Shipping',
          price: 12.99,
          estimatedDays: '2-3 business days'
        },
        {
          id: 'overnight',
          name: 'Overnight Shipping',
          price: 24.99,
          estimatedDays: '1 business day'
        }
      ];

      // Free shipping for orders over $50
      const freeShippingOption = {
        id: 'free',
        name: 'Free Shipping',
        price: 0,
        estimatedDays: '5-7 business days'
      };

      return [freeShippingOption, ...baseOptions];
    }, { operation: 'getShippingOptions' })();
  }
}

export const checkoutService = new CheckoutService();
