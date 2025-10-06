import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../../context/CartContext';
import { formatPrice } from '../../../utils/helpers';
import styles from './CartItem.module.css';

const CartItem = memo(({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, newQuantity);
  };

  const handleIncrement = () => {
    handleQuantityChange(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className={styles.cartItem} data-testid={`cart-item-${item.id}`}>
      <div className={styles.imageContainer}>
        <img
          src={item.image}
          alt={item.name}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <h3 className={styles.name}>{item.name}</h3>
          <button
            className={styles.removeButton}
            onClick={handleRemove}
            aria-label={`Remove ${item.name} from cart`}
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div className={styles.price}>
          {formatPrice(item.price)} each
        </div>

        <div className={styles.controls}>
          <div className={styles.quantityControls}>
            <button
              className={styles.quantityButton}
              onClick={handleDecrement}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <i className="fas fa-minus" aria-hidden="true"></i>
            </button>
            
            <span className={styles.quantity} aria-live="polite">
              {item.quantity}
            </span>
            
            <button
              className={styles.quantityButton}
              onClick={handleIncrement}
              aria-label={`Increase quantity of ${item.name}`}
            >
              <i className="fas fa-plus" aria-hidden="true"></i>
            </button>
          </div>

          <div className={styles.total}>
            Total: <strong>{formatPrice(totalPrice)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
});

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired
  }).isRequired
};

export default CartItem;