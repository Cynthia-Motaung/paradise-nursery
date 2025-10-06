import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = ({ onNavigate }) => {
  const { cart, getCartTotal, getCartItemsCount, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty. Add some plants before checking out!');
      return;
    }
    
    alert('Thank you for your order! Your plants will be delivered soon.');
    clearCart();
    onNavigate('products');
  };

  return (
    <section className="page cart active">
      <div className="container">
        <h1 className="page-title">Your Shopping Cart</h1>
        
        <div className="cart-container">
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-totals">
              <span>Total Items: <span id="total-items">{getCartItemsCount()}</span></span>
              <span>Total Cost: $<span id="total-cost">{getCartTotal().toFixed(2)}</span></span>
            </div>
            <div className="cart-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => onNavigate('products')}
              >
                Continue Shopping
              </button>
              <button className="btn" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
          
          <div className="cart-items">
            {cart.items.length === 0 ? (
              <div className="empty-cart">
                <i className="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Add some beautiful plants to your cart!</p>
                <button 
                  className="btn" 
                  onClick={() => onNavigate('products')}
                >
                  Browse Plants
                </button>
              </div>
            ) : (
              cart.items.map(item => (
                <CartItem key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;