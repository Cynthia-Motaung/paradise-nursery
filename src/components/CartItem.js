import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (change) => {
    updateQuantity(item.id, change);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <div className="cart-item-header">
          <h3 className="cart-item-name">{item.name}</h3>
          <div className="cart-item-price">${item.price.toFixed(2)}</div>
        </div>
        <div className="cart-item-controls">
          <div className="quantity-controls">
            <button 
              className="quantity-btn" 
              onClick={() => handleQuantityChange(-1)}
            >
              <i className="fas fa-minus"></i>
            </button>
            <span className="quantity">{item.quantity}</span>
            <button 
              className="quantity-btn" 
              onClick={() => handleQuantityChange(1)}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="item-total">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
          <button className="delete-btn" onClick={handleRemove}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;