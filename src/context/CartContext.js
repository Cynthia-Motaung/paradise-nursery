import React, { createContext, useContext, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useCartPersistence } from '../hooks/useLocalStorage';
import { calculateCartTotal, calculateCartItemsCount } from '../utils/helpers';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

const CartContext = createContext();

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART'
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }]
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.productId)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return { ...state, items: [] };
    }

    case CART_ACTIONS.SET_CART: {
      return { ...state, items: action.payload.items || [] };
    }

    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart to localStorage
  useCartPersistence(state, dispatch);

  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId }
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  const setCart = useCallback((items) => {
    dispatch({
      type: CART_ACTIONS.SET_CART,
      payload: { items }
    });
  }, []);

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
    getCartItem
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