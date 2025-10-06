import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../../context/CartContext';
import { formatPrice } from '../../../utils/helpers';
import { SUCCESS_MESSAGES } from '../../../utils/constants';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import styles from './ProductCard.module.css';

const ProductCard = memo(({ product, onAddToCart }) => {
  const { addToCart, isInCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    
    try {
      await addToCart(product);
      onAddToCart?.(product, SUCCESS_MESSAGES.ADDED_TO_CART);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    console.error('Error loading image:', product.image);
    e.target.src = '/images/placeholder-plant.jpg';
  };

  const isProductInCart = isInCart(product.id);

  return (
    <article className={styles.card} data-testid={`product-card-${product.id}`}>
      <div className={styles.imageContainer}>
        {!imageLoaded && (
          <div className={styles.imagePlaceholder}>
            <LoadingSpinner size="small" />
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`${styles.image} ${imageLoaded ? styles.imageLoaded : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        {product.isNew && <span className={styles.newBadge}>New</span>}
        {product.isBestSeller && (
          <span className={styles.bestSellerBadge}>Best Seller</span>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.footer}>
          <div className={styles.price}>{formatPrice(product.price)}</div>
          <button
            className={`${styles.addButton} ${
              isProductInCart ? styles.inCart : ''
            } ${addingToCart ? styles.loading : ''}`}
            onClick={handleAddToCart}
            disabled={addingToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            {addingToCart ? (
              <LoadingSpinner size="small" />
            ) : isProductInCart ? (
              <>
                <i className="fas fa-check" aria-hidden="true"></i>
                Added
              </>
            ) : (
              <>
                <i className="fas fa-cart-plus" aria-hidden="true"></i>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
});

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    isNew: PropTypes.bool,
    isBestSeller: PropTypes.bool,
    inStock: PropTypes.bool
  }).isRequired,
  onAddToCart: PropTypes.func
};

ProductCard.defaultProps = {
  onAddToCart: () => {}
};

export default ProductCard;