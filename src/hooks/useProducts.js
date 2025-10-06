import { useState, useEffect } from 'react';
import { products } from '../data/products';

export const useProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAllProducts(products);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getProductsByCategory = (category) => {
    if (category === 'all') return allProducts;
    return allProducts.filter(product => product.category === category);
  };

  const getProductById = (id) => {
    return allProducts.find(product => product.id === id);
  };

  return {
    products: allProducts,
    loading,
    error,
    getProductsByCategory,
    getProductById
  };
};