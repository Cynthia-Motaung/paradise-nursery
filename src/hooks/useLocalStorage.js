import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Custom hook for cart persistence
 */
export const useCartPersistence = (cart, setCart) => {
  useEffect(() => {
    if (cart && cart.items) {
      try {
        localStorage.setItem('paradise_nursery_cart', JSON.stringify(cart.items));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    }
  }, [cart]);

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem('paradise_nursery_cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCart({ items: parsedCart });
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    };

    loadCart();
  }, [setCart]);
};