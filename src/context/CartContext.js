
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useCartPersistence } from '../hooks/useLocalStorage';
import { calculateCartTotal, calculateCartItemsCount } from '../utils/helpers';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';
import { withErrorHandling, createError, ErrorCodes, safeLocalStorage } from '../utils/errorHandler';

const CartContext = createContext();

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART',
  CART_ERROR: 'CART_ERROR'
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      
      // Validate product
      if (!product || !product.id || !product.price) {
        return {
          ...state,
          error: createError('Invalid product data', ErrorCodes.VALIDATION_ERROR, { product })
        };
      }

      const existingItemIndex = state.items.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return { ...state, items: updatedItems, error: null };
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
        error: null
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.productId),
        error: null
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId),
          error: null
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        ),
        error: null
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return { ...state, items: [], error: null };
    }

    case CART_ACTIONS.SET_CART: {
      return { ...state, items: action.payload.items || [], error: null };
    }

    case CART_ACTIONS.CART_ERROR: {
      return { ...state, error: action.payload.error };
    }

    default:
      return state;
  }
};

const initialState = {
  items: [],
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Enhanced cart persistence with error handling
  useCartPersistence(state, dispatch);

  const addToCart = useCallback(withErrorHandling(async (product, quantity = 1) => {
    if (!product || typeof product.price !== 'number') {
      throw createError('Invalid product', ErrorCodes.VALIDATION_ERROR, { product });
    }

    if (quantity <= 0) {
      throw createError('Quantity must be positive', ErrorCodes.VALIDATION_ERROR, { quantity });
    }

    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });

    return { success: true, message: SUCCESS_MESSAGES.ADDED_TO_CART };
  }, { operation: 'addToCart' }), []);

  const removeFromCart = useCallback(withErrorHandling(async (productId) => {
    if (!productId) {
      throw createError('Product ID is required', ErrorCodes.VALIDATION_ERROR);
    }

    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId }
    });

    return { success: true, message: 'Item removed from cart' };
  }, { operation: 'removeFromCart' }), []);

  const updateQuantity = useCallback(withErrorHandling(async (productId, quantity) => {
    if (!productId) {
      throw createError('Product ID is required', ErrorCodes.VALIDATION_ERROR);
    }

    if (quantity < 0) {
      throw createError('Quantity cannot be negative', ErrorCodes.VALIDATION_ERROR, { quantity });
    }

    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });

    return { success: true, message: SUCCESS_MESSAGES.CART_UPDATED };
  }, { operation: 'updateQuantity' }), []);

  const clearCart = useCallback(withErrorHandling(async () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    return { success: true, message: 'Cart cleared' };
  }, { operation: 'clearCart' }), []);

  const setCart = useCallback(withErrorHandling(async (items) => {
    if (!Array.isArray(items)) {
      throw createError('Items must be an array', ErrorCodes.VALIDATION_ERROR, { items });
    }

    dispatch({
      type: CART_ACTIONS.SET_CART,
      payload: { items }
    });

    return { success: true, message: 'Cart updated' };
  }, { operation: 'setCart' }), []);

  const getCartTotal = useCallback(() => {
    return calculateCartTotal(state.items);
  }, [state.items]);

  const getCartItemsCount = useCallback(() => {
    return calculateCartItemsCount(state.items);
  }, [state.items]);

  const isInCart = useCallback((productId) => {
    return state.items.some(item => item.id === productId);
  }, [state.items]);

  const getCartItem = useCallback((productId) => {
    return state.items.find(item => item.id === productId);
  }, [state.items]);

  const clearError = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CART_ERROR, payload: { error: null } });
  }, []);

  const value = {
    cart: state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem,
    clearError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
