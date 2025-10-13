// src/hooks/useProducts.js
import { useState, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getAll();
      
      // Handle both response formats
      let productsData;
      if (response && response.data) {
        productsData = response.data; // Live service format
      } else if (Array.isArray(response)) {
        productsData = response; // Mock service format
      } else {
        throw new Error('Invalid data format received');
      }
      
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductsByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getByCategory(category);
      
      // Handle both response formats
      let productsData;
      if (response && response.data) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      } else {
        productsData = response; // Assume it's already an array
      }
      
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products by category:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // First, get all products (or category products)
      let allProducts;
      if (filters.category) {
        const response = await productService.getByCategory(filters.category);
        allProducts = response.data || response;
      } else {
        const response = await productService.getAll();
        allProducts = response.data || response;
      }
      
      // Perform client-side search
      const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(query.toLowerCase()))
      );
      
      setProducts(filteredProducts);
    } catch (err) {
      setError(err.message);
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    getProductsByCategory,
    searchProducts
  };
};