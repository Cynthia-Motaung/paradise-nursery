
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkoutService } from '../../services/checkoutServices';
import CheckoutForm from '../../components/checkout/CheckoutForm/CheckoutForm';
import OrderSummary from '../../components/checkout/OrderSummary/OrderSummary';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import styles from './Checkout.module.css';

const Checkout = ({ onNavigate }) => {
  const { cart, getCartTotal, getCartItemsCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckout = async (checkoutData) => {
    if (cart.items.length === 0) {
      setError('Your cart is empty. Add some plants before checking out!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare checkout data
      const checkoutPayload = {
        cart,
        customerInfo: {
          email: user?.email || checkoutData.email,
          name: user?.name || `${checkoutData.shippingAddress.firstName} ${checkoutData.shippingAddress.lastName}`
        },
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod
      };

      // Process checkout
      const orderResult = await checkoutService.processCheckout(checkoutPayload);
      
      setOrder(orderResult);
      
      // Clear cart on success
      clearCart();
      
      // Log successful order
      console.log('Order placed successfully:', orderResult);
      
    } catch (err) {
      setError(err.message);
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    onNavigate('products');
  };

  const handleViewOrder = (orderId) => {
    // Navigate to order details page
    console.log('View order:', orderId);
    // TODO: Implement order details page
  };

  if (loading) {
    return (
      <section className={styles.container}>
        <div className="container">
          <div className={styles.loadingContainer}>
            <LoadingSpinner 
              size="large" 
              text="Processing your order..." 
            />
          </div>
        </div>
      </section>
    );
  }

  if (order) {
    return (
      <section className={styles.container}>
        <div className="container">
          <div className={styles.successContainer}>
            <i className="fas fa-check-circle"></i>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your order. We've sent a confirmation email to {user?.email}.</p>
            
            <div className={styles.orderDetails}>
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Total:</strong> ${order.total?.toFixed(2)}</p>
              <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
            </div>

            <div className={styles.actions}>
              <button 
                className="btn btn--secondary"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
              <button 
                className="btn"
                onClick={() => handleViewOrder(order.id)}
              >
                View Order Details
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (cart.items.length === 0) {
    return (
      <section className={styles.container}>
        <div className="container">
          <div className={styles.emptyContainer}>
            <i className="fas fa-shopping-cart"></i>
            <h1>Your Cart is Empty</h1>
            <p>Add some beautiful plants to your cart before checking out.</p>
            <button 
              className="btn"
              onClick={handleContinueShopping}
            >
              Browse Plants
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className="container">
        <h1 className={styles.pageTitle}>Checkout</h1>
        
        {error && (
          <div className={styles.errorBanner}>
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
            <button 
              className={styles.closeError}
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        <div className={styles.checkoutLayout}>
          <div className={styles.formSection}>
            <CheckoutForm 
              onSubmit={handleCheckout}
              user={user}
              isAuthenticated={isAuthenticated}
            />
          </div>
          
          <div className={styles.summarySection}>
            <OrderSummary 
              cart={cart}
              getCartTotal={getCartTotal}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

Checkout.propTypes = {
  onNavigate: PropTypes.func.isRequired
};

export default Checkout;
