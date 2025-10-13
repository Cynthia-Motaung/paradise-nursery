// src/components/checkout/OrderSummary/OrderSummary.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderSummary.module.css';

const OrderSummary = ({ cart, getCartTotal }) => {
  const shippingCost = 5.99;
  const taxRate = 0.08;
  
  const subtotal = getCartTotal();
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  return (
    <div className={styles.summaryContainer}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>
      
      <div className={styles.itemsList}>
        {cart.items.map(item => (
          <div key={item.id} className={styles.item}>
            <img 
              src={item.image} 
              alt={item.name}
              className={styles.itemImage}
            />
            <div className={styles.itemDetails}>
              <h4 className={styles.itemName}>{item.name}</h4>
              <p className={styles.itemPrice}>${item.price.toFixed(2)} × {item.quantity}</p>
            </div>
            <div className={styles.itemTotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.priceBreakdown}>
        <div className={styles.priceRow}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.priceRow}>
          <span>Shipping</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        <div className={styles.priceRow}>
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={`${styles.priceRow} ${styles.total}`}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.securityNote}>
        <i className="fas fa-lock"></i>
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  cart: PropTypes.object.isRequired,
  getCartTotal: PropTypes.func.isRequired
};

export default OrderSummary;