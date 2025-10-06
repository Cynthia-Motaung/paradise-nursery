import React, { useState, useEffect } from 'react';
import { products, categories } from '../../data/products';
import CategoryFilter from '../../components/products/CategoryFilter/CategoryFilter';
import ProductGrid from '../../components/products/ProductGrid/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import styles from './Products.module.css';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const handleAddToCart = (product, message) => {
    // This would typically be handled by a notification system
    console.log(message, product.name);
  };

  if (error) {
    return (
      <section className={styles.container}>
        <div className="container">
          <div className={styles.errorContainer}>
            <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
            <h2>Unable to Load Products</h2>
            <p>There was a problem loading our plant collection. Please try again later.</p>
            <button 
              className="btn" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className="container">
        <h1 className={styles.pageTitle}>Our Plant Collection</h1>
        
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size="large" text="Loading our beautiful plants..." />
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </section>
  );
};

export default Products;