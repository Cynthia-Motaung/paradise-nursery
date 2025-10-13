import React, { useState, useEffect } from 'react';
import { categories } from '../../data/products';
import CategoryFilter from '../../components/products/CategoryFilter/CategoryFilter';
import ProductGrid from '../../components/products/ProductGrid/ProductGrid';
import SearchBar from '../../components/products/SearchBar/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { useProducts } from '../../hooks/useProducts';
import { productService } from '../../services/productService';
import styles from './Products.module.css';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    products: productList,
    loading,
    error,
    loadProducts,
    searchProducts,
    getProductsByCategory
  } = useProducts();

  // Handle category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      loadProducts();
    } else {
      getProductsByCategory(activeCategory);
    }
  }, [activeCategory, loadProducts, getProductsByCategory]);

  // Define handleCategoryChange function
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery(''); // Clear search when changing category
  };

  // Define handleSearch function
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      // If search is cleared, return to current category view
      if (activeCategory === 'all') {
        loadProducts();
      } else {
        getProductsByCategory(activeCategory);
      }
    } else {
      // Perform search across all products or within category
      const searchFilters = activeCategory !== 'all' ? { category: activeCategory } : {};
      await searchProducts(query, searchFilters);
    }
  };

  // Define handleAddToCart function
  const handleAddToCart = (product, message) => {
    // Show success notification
    console.log(message, product.name);
    // TODO: Integrate with toast notification system
  };

  // Define handleClearSearch function
  const handleClearSearch = () => {
    setSearchQuery('');
    if (activeCategory === 'all') {
      loadProducts();
    } else {
      getProductsByCategory(activeCategory);
    }
  };

  // Define handleRetry function
  const handleRetry = () => {
    if (activeCategory === 'all') {
      loadProducts();
    } else {
      getProductsByCategory(activeCategory);
    }
  };

  if (error) {
    return (
      <section className={styles.container}>
        <div className="container">
          <div className={styles.errorContainer}>
            <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
            <h2>Unable to Load Products</h2>
            <p>{error}</p>
            <button 
              className="btn" 
              onClick={handleRetry}
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
        
        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search for plants..."
          initialValue={searchQuery}
        />
        
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Search Results Info */}
        {searchQuery && (
          <div className={styles.searchInfo}>
            <p>
              Search results for "<strong>{searchQuery}</strong>"
              {activeCategory !== 'all' && (
                <> in <strong>{categories.find(c => c.id === activeCategory)?.name}</strong></>
              )}
              {!loading && (
                <> - {productList.length} plant{productList.length !== 1 ? 's' : ''} found</>
              )}
            </p>
            <button 
              className={styles.clearSearch}
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          </div>
        )}
        
        {/* Loading or Product Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner 
              size="large" 
              text={searchQuery ? "Searching plants..." : "Loading our beautiful plants..."} 
            />
          </div>
        ) : (
          <ProductGrid
            products={productList}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </section>
  );
};

export default Products;