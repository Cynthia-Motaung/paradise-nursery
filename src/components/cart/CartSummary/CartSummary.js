
import React from 'react';
import PropTypes from 'prop-types';
import { formatPrice, calculateShipping } from '../../../utils/helpers';
import styles from './CartSummary.module.css';

const CartSummary = ({ 
  itemsCount, 
  subtotal, 
  onContinueShopping, 
  onCheckout,
  checkoutLoading = false 
}) => {
  const shipping = calculateShipping(subtotal, itemsCount);
  const total = subtotal + shipping;
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className={styles.summary}>
      <h2 className={styles.title}>Order Summary</h2>
      
      <div className={styles.details}>
        <div className={styles.row}>
          <span>Items ({itemsCount})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className={styles.row}>
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className={styles.freeShipping}>FREE</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        
        {shipping > 0 && remainingForFreeShipping > 0 && (
          <div className={styles.shippingMessage}>
            <i className="fas fa-truck" aria-hidden="true"></i>
            Add {formatPrice(remainingForFreeShipping)} more for free shipping!
          </div>
        )}
        
        {shipping === 0 && (
          <div className={styles.freeShippingMessage}>
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            You've got free shipping!
          </div>
        )}
        
        <hr className={styles.divider} />
        
        <div className={`${styles.row} ${styles.total}`}>
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className="btn btn--secondary"
          onClick={onContinueShopping}
          disabled={checkoutLoading}
        >
          Continue Shopping
        </button>
        <button
          className="btn"
          onClick={onCheckout}
          disabled={itemsCount === 0 || checkoutLoading}
        >
          {checkoutLoading ? (
            <>
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              Processing...
            </>
          ) : (
            'Proceed to Checkout'
          )}
        </button>
      </div>

      {itemsCount === 0 && (
        <p className={styles.emptyMessage}>
          Your cart is empty. Add some plants to see your order summary.
        </p>
      )}
    </div>
  );
};

CartSummary.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  subtotal: PropTypes.number.isRequired,
  onContinueShopping: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
  checkoutLoading: PropTypes.bool
};

export default CartSummary;