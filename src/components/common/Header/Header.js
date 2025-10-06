import React from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../../context/CartContext';
import styles from './Header.module.css';

const Header = ({ currentPage, onNavigate }) => {
  const { getCartItemsCount } = useCart();

  const handleNavigation = (page) => {
    onNavigate(page);
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  return (
    <header className={styles.header} role="banner">
      <div className="container">
        <div className={styles.headerContent}>
          <button
            className={styles.logo}
            onClick={() => handleNavigation('landing')}
            aria-label="Paradise Nursery - Go to homepage"
          >
            <i className="fas fa-leaf" aria-hidden="true"></i>
            <span>Paradise Nursery</span>
          </button>
          
          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.navList}>
              <li>
                <button
                  className={`${styles.navLink} ${currentPage === 'landing' ? styles.active : ''}`}
                  onClick={() => handleNavigation('landing')}
                  aria-current={currentPage === 'landing' ? 'page' : undefined}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  className={`${styles.navLink} ${currentPage === 'products' ? styles.active : ''}`}
                  onClick={() => handleNavigation('products')}
                  aria-current={currentPage === 'products' ? 'page' : undefined}
                >
                  Plants
                </button>
              </li>
              <li>
                <button
                  className={`${styles.navLink} ${currentPage === 'cart' ? styles.active : ''}`}
                  onClick={() => handleNavigation('cart')}
                  aria-current={currentPage === 'cart' ? 'page' : undefined}
                >
                  Cart
                </button>
              </li>
            </ul>
          </nav>

          <button
            className={styles.cartIcon}
            onClick={() => handleNavigation('cart')}
            aria-label={`Shopping cart with ${getCartItemsCount()} items`}
          >
            <i className="fas fa-shopping-cart" aria-hidden="true"></i>
            {getCartItemsCount() > 0 && (
              <span className={styles.cartCount} aria-live="polite">
                {getCartItemsCount()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  currentPage: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default Header;