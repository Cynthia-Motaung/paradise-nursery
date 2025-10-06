import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ProductCard from '../ProductCard/ProductCard';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import styles from './ProductGrid.module.css';

const ProductGrid = memo(({ products, loading, onAddToCart }) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading plants..." />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={styles.emptyState} role="status">
        <i className="fas fa-seedling" aria-hidden="true"></i>
        <h3>No plants found</h3>
        <p>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  const handleAddToCart = (product, message) => {
    onAddToCart?.(product, message);
    
    // Show temporary notification (could be enhanced with a toast notification system)
    if (message) {
      // In a real app, you might use a toast notification system here
      console.log(message, product.name);
    }
  };

  return (
    <div className={styles.grid}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
});

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onAddToCart: PropTypes.func
};

ProductGrid.defaultProps = {
  products: [],
  loading: false
};

export default ProductGrid;