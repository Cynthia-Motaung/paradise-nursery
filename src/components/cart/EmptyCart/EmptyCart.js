import React from 'react';
import PropTypes from 'prop-types';
import styles from './EmptyCart.module.css';

const EmptyCart = ({ onBrowsePlants }) => {
  return (
    <div className={styles.emptyCart} role="status" aria-label="Shopping cart is empty">
      <div className={styles.content}>
        <i className="fas fa-shopping-cart" aria-hidden="true"></i>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any plants to your cart yet.</p>
        <button className="btn" onClick={onBrowsePlants}>
          Browse Our Plants
        </button>
      </div>
    </div>
  );
};

EmptyCart.propTypes = {
  onBrowsePlants: PropTypes.func.isRequired
};

export default EmptyCart;