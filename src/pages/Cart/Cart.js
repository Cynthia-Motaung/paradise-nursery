import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem/CartItem';
import CartSummary from '../../components/cart/CartSummary/CartSummary';
import EmptyCart from '../../components/cart/EmptyCart/EmptyCart';
import styles from './Cart.module.css';

const Cart = ({ onNavigate }) => {
  const { cart, getCartTotal, getCartItemsCount, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty. Add some plants before checking out!');
      return;
    }
    
    setCheckoutLoading(true);
    
    // Simulate checkout process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Thank you for your order! Your plants will be delivered soon.');
      clearCart();
      onNavigate('products');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was a problem with your order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleContinueShopping = () => {
    onNavigate('products');
  };

  const handleBrowsePlants = () => {
    onNavigate('products');
  };

  if (cart.items.length === 0) {
    return (
      <section className={styles.container}>
        <div className="container">
          <h1 className={styles.pageTitle}>Your Shopping Cart</h1>
          <div className={styles.emptyState}>
            <EmptyCart onBrowsePlants={handleBrowsePlants} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className="container">
        <h1 className={styles.pageTitle}>Your Shopping Cart</h1>
        
        <div className={styles.cartLayout}>
          <div className={styles.cartItems}>
            {cart.items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          
          <CartSummary
            itemsCount={getCartItemsCount()}
            subtotal={getCartTotal()}
            onContinueShopping={handleContinueShopping}
            onCheckout={handleCheckout}
            checkoutLoading={checkoutLoading}
          />
        </div>
      </div>
    </section>
  );
};

Cart.propTypes = {
  onNavigate: PropTypes.func.isRequired
};

export default Cart;