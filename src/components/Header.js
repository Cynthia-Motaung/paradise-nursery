import React from 'react';
import { useCart } from '../context/CartContext';

const Header = ({ currentPage, onNavigate }) => {
  const { getCartItemsCount } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a 
            href="#landing" 
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('landing');
            }}
          >
            <i className="fas fa-leaf"></i>
            Paradise Nursery
          </a>
          <nav>
            <ul>
              <li>
                <a 
                  href="#landing" 
                  className={currentPage === 'landing' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('landing');
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#products" 
                  className={currentPage === 'products' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('products');
                  }}
                >
                  Plants
                </a>
              </li>
              <li>
                <a 
                  href="#cart" 
                  className={currentPage === 'cart' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('cart');
                  }}
                >
                  Cart
                </a>
              </li>
            </ul>
          </nav>
          <a 
            href="#cart" 
            className="cart-icon"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('cart');
            }}
          >
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{getCartItemsCount()}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;